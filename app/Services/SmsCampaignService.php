<?php

namespace App\Services;

use App\Models\SmsCampaign;
use App\Models\SmsCampaignLog;
use App\Rules\E164PhoneNumber;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class SmsCampaignService
{
    /**
     * Parse phone numbers from a CSV file.
     * Validates E.164 format, removes duplicates and invalid rows.
     *
     * @return array<string>
     */
    public function parsePhoneNumbersFromCsv(UploadedFile $file): array
    {
        $phoneNumbers = [];
        $e164Rule = new E164PhoneNumber;
        $csvContent = file_get_contents($file->getRealPath());
        $lines = preg_split('/\r\n|\r|\n/', $csvContent);

        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }

            // Handle CSV with multiple columns — take the first column
            $columns = str_getcsv($line);
            $phone = trim($columns[0] ?? '');

            // Strip any surrounding quotes
            $phone = trim($phone, '"\'');

            if ($phone === '' || ! $e164Rule->isValid($phone)) {
                continue;
            }

            $phoneNumbers[] = $phone;
        }

        // Deduplicate
        return array_values(array_unique($phoneNumbers));
    }

    /**
     * Create a campaign and its log entries from parsed phone numbers.
     *
     * @param  array<string, mixed>  $campaignData
     * @param  array<string>  $phoneNumbers
     */
    public function createCampaignWithLogs(array $campaignData, array $phoneNumbers): SmsCampaign
    {
        $campaign = SmsCampaign::create(array_merge($campaignData, [
            'total_numbers' => count($phoneNumbers),
            'pending_count' => count($phoneNumbers),
        ]));

        foreach ($phoneNumbers as $phone) {
            SmsCampaignLog::create([
                'sms_campaign_id' => $campaign->id,
                'phone_number' => $phone,
                'message' => $campaign->message,
                'status' => 'pending',
            ]);
        }

        Log::channel('clicksend')->info("Campaign #{$campaign->id} created", [
            'name' => $campaign->name,
            'total_numbers' => count($phoneNumbers),
            'schedule_type' => $campaign->schedule_type,
        ]);

        return $campaign;
    }

    /**
     * Calculate the next run time for a campaign.
     */
    public function calculateNextRunAt(SmsCampaign $campaign): ?CarbonInterface
    {
        if ($campaign->isOneTime()) {
            return $campaign->scheduled_at;
        }

        if ($campaign->isDaily() && $campaign->daily_time) {
            $tz = $campaign->timezone ?? config('app.timezone');
            [$hour, $minute] = explode(':', $campaign->daily_time);

            $nextRun = Carbon::now($tz)
                ->setTime((int) $hour, (int) $minute, 0);

            // If the time already passed today, schedule for tomorrow
            if ($nextRun->isPast()) {
                $nextRun->addDay();
            }

            return $nextRun->utc();
        }

        return null;
    }

    /**
     * Reset campaign logs to pending for a new daily run.
     */
    public function resetLogsForNewRun(SmsCampaign $campaign): void
    {
        $campaign->logs()->update(['status' => 'pending', 'error_reason' => null, 'provider_message_id' => null, 'provider_response' => null, 'sent_at' => null]);

        $campaign->update([
            'sent_count' => 0,
            'failed_count' => 0,
            'pending_count' => $campaign->total_numbers,
        ]);
    }
}
