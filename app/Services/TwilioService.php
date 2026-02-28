<?php

namespace App\Services;

use App\Jobs\SendBulkSmsJob;
use App\Models\BulkSmsCampaign;
use App\Models\SmsLog;
use Exception;
use Illuminate\Support\Facades\Storage;
use League\Csv\Reader;
use Twilio\Rest\Client;

class TwilioService
{
    protected ?Client $client = null;

    protected string $fromUK;

    protected string $fromUS;

    public function __construct()
    {
        $this->fromUK = config('services.twilio.from_uk') ?? '';
        $this->fromUS = config('services.twilio.from_us') ?? '';
    }

    /**
     * Lazily resolve the Twilio client.
     */
    protected function client(): Client
    {
        if (! $this->client) {
            $this->client = new Client(
                config('services.twilio.sid'),
                config('services.twilio.token')
            );
        }

        return $this->client;
    }

    /**
     * Send a single SMS message.
     *
     * @return array{success: bool, sid?: string, status?: string, error?: string}
     */
    public function sendSMS(string $to, string $message): array
    {
        try {
            $to = $this->formatNumber($to);
            $from = $this->selectSender($to);

            $msg = $this->client()->messages->create($to, [
                'from' => $from,
                'body' => $message,
            ]);

            SmsLog::create([
                'to' => $to,
                'from' => $from,
                'message' => $message,
                'status' => 'sent',
                'twilio_sid' => $msg->sid,
                'type' => 'single',
            ]);

            return ['success' => true, 'sid' => $msg->sid, 'status' => $msg->status];
        } catch (Exception $e) {
            SmsLog::create([
                'to' => $to,
                'message' => $message,
                'status' => 'failed',
                'type' => 'single',
                'error_message' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
    /**
     * Parse a CSV file and dispatch bulk SMS jobs for each record.
     *
     * @return array{success: bool, campaign?: BulkSmsCampaign, total?: int, invalid?: int, error?: string}
     */
    public function processBulkCsvAndDispatch(
        string $campaignName,
        string $message,
        string $csvFilePath,
        int $userId
    ): array {
        try {
            $fullPath = Storage::disk('local')->path($csvFilePath);
            $csv = Reader::createFromPath($fullPath, 'r');
            $csv->setHeaderOffset(0);

            $headers = $csv->getHeader();

            $phoneColumn = collect($headers)->first(function ($h) {
                return in_array(strtolower(trim($h)), ['phone', 'mobile', 'number', 'phone_number', 'mobile_number', 'phone number', 'mobile number']);
            });

            if (! $phoneColumn) {
                return [
                    'success' => false,
                    'error' => 'CSV must have a column named: phone, mobile, number, phone_number, phone number, or mobile_number',
                ];
            }

            $records = iterator_to_array($csv->getRecords());
            $total = count($records);

            if ($total === 0) {
                return ['success' => false, 'error' => 'CSV file has no records.'];
            }

            $campaign = BulkSmsCampaign::create([
                'name' => $campaignName,
                'message' => $message,
                'csv_file_path' => $csvFilePath,
                'total_recipients' => $total,
                'status' => 'processing',
                'created_by' => $userId,
                'started_at' => now(),
            ]);

            $invalidCount = 0;

            foreach ($records as $record) {
                $phone = trim($record[$phoneColumn] ?? '');

                if (empty($phone)) {
                    $campaign->increment('failed_count');
                    $invalidCount++;

                    continue;
                }

                $personalizedMessage = $this->personalizeMessage($message, $record);

                SendBulkSmsJob::dispatch($phone, $personalizedMessage, $campaign->id)
                    ->delay(now()->addSeconds(rand(1, 3)));
            }

            return [
                'success' => true,
                'campaign' => $campaign,
                'total' => $total,
                'invalid' => $invalidCount,
            ];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Dispatch bulk SMS jobs from a manual list of phone numbers.
     *
     * @param  array<int, string>  $phoneNumbers
     * @return array{success: bool, campaign?: BulkSmsCampaign, total?: int, error?: string}
     */
    public function dispatchBulkFromNumbers(
        string $campaignName,
        string $message,
        array $phoneNumbers,
        int $userId
    ): array {
        $phoneNumbers = array_filter(array_map('trim', $phoneNumbers));
        $total = count($phoneNumbers);

        if ($total === 0) {
            return ['success' => false, 'error' => 'No valid phone numbers provided.'];
        }

        $campaign = BulkSmsCampaign::create([
            'name' => $campaignName,
            'message' => $message,
            'total_recipients' => $total,
            'status' => 'processing',
            'created_by' => $userId,
            'started_at' => now(),
        ]);

        foreach ($phoneNumbers as $phone) {
            SendBulkSmsJob::dispatch($phone, $message, $campaign->id)
                ->delay(now()->addSeconds(rand(1, 3)));
        }

        return ['success' => true, 'campaign' => $campaign, 'total' => $total];
    }

    /**
     * Replace {column_name} placeholders in the message with CSV record values.
     *
     * @param  array<string, string>  $record
     */
    private function personalizeMessage(string $message, array $record): string
    {
        foreach ($record as $key => $value) {
            $message = str_replace('{'.strtolower($key).'}', $value, $message);
        }

        return $message;
    }

    /**
     * Normalize a phone number to E.164 format.
     */
    public function formatNumber(string $number): string
    {
        $number = preg_replace('/[^0-9+]/', '', $number);

        // Bangladesh: 01XXXXXXXXX → +8801XXXXXXXXX
        if (preg_match('/^01[3-9]\d{8}$/', $number)) {
            return '+880'.$number;
        }

        // UK: 07XXXXXXXXX → +447XXXXXXXXX
        if (preg_match('/^07\d{9}$/', $number)) {
            return '+44'.ltrim($number, '0');
        }

        if (str_starts_with($number, '+')) {
            return $number;
        }

        return '+'.$number;
    }

    /**
     * Auto-select the correct sender number based on the recipient's country code.
     */
    public function selectSender(string $to): string
    {
        if (str_starts_with($to, '+44')) {
            return $this->fromUK;
        }

        return $this->fromUK ?? $this->fromUS;
    }
}
