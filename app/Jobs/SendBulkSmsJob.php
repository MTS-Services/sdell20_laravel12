<?php

namespace App\Jobs;

use App\Models\BulkSmsCampaign;
use App\Models\SmsLog;
use App\Services\TwilioService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendBulkSmsJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $phone,
        public string $message,
        public int $campaignId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(TwilioService $twilio): void
    {
        $campaign = BulkSmsCampaign::find($this->campaignId);

        if (! $campaign) {
            return;
        }

        $formattedPhone = $twilio->formatNumber($this->phone);
        $from = $twilio->selectSender($formattedPhone);

        try {
            $msg = $twilio->sendSMS($formattedPhone, $this->message);

            if ($msg['success']) {
                SmsLog::create([
                    'to' => $formattedPhone,
                    'from' => $from,
                    'message' => $this->message,
                    'status' => 'sent',
                    'twilio_sid' => $msg['sid'] ?? null,
                    'type' => 'bulk',
                    'bulk_campaign_id' => $this->campaignId,
                ]);

                $campaign->increment('sent_count');
            } else {
                SmsLog::create([
                    'to' => $formattedPhone,
                    'message' => $this->message,
                    'status' => 'failed',
                    'type' => 'bulk',
                    'bulk_campaign_id' => $this->campaignId,
                    'error_message' => $msg['error'] ?? 'Unknown error',
                ]);

                $campaign->increment('failed_count');
            }
        } catch (\Exception $e) {
            SmsLog::create([
                'to' => $formattedPhone,
                'message' => $this->message,
                'status' => 'failed',
                'type' => 'bulk',
                'bulk_campaign_id' => $this->campaignId,
                'error_message' => $e->getMessage(),
            ]);

            $campaign->increment('failed_count');
        }

        $campaign->refresh();

        if (($campaign->sent_count + $campaign->failed_count) >= $campaign->total_recipients) {
            $campaign->update([
                'status' => $campaign->failed_count === $campaign->total_recipients ? 'failed' : 'completed',
                'completed_at' => now(),
            ]);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(?\Throwable $exception): void
    {
        $campaign = BulkSmsCampaign::find($this->campaignId);

        if ($campaign) {
            SmsLog::create([
                'to' => $this->phone,
                'message' => $this->message,
                'status' => 'failed',
                'type' => 'bulk',
                'bulk_campaign_id' => $this->campaignId,
                'error_message' => $exception?->getMessage() ?? 'Job failed after max retries',
            ]);

            $campaign->increment('failed_count');

            $campaign->refresh();

            if (($campaign->sent_count + $campaign->failed_count) >= $campaign->total_recipients) {
                $campaign->update([
                    'status' => $campaign->failed_count === $campaign->total_recipients ? 'failed' : 'completed',
                    'completed_at' => now(),
                ]);
            }
        }
    }
}
