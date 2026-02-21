<?php

namespace App\Jobs;

use App\Exceptions\ClickSendException;
use App\Models\SmsCampaign;
use App\Models\SmsCampaignLog;
use App\Services\ClickSendSmsService;
use App\Services\SmsCampaignService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessSmsCampaignJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;

    public int $timeout = 600;

    public function __construct(private readonly int $campaignId) {}

    public function handle(ClickSendSmsService $smsService, SmsCampaignService $campaignService): void
    {
        /** @var SmsCampaign|null $campaign */
        $campaign = SmsCampaign::find($this->campaignId);

        if (! $campaign) {
            Log::channel('clicksend')->warning("Campaign #{$this->campaignId} not found, skipping.");

            return;
        }

        if (! $campaign->is_enabled) {
            Log::channel('clicksend')->info("Campaign #{$this->campaignId} is disabled, skipping.");

            return;
        }

        $campaign->update(['status' => 'running', 'last_run_at' => now()]);

        $pendingLogs = $campaign->logs()->where('status', 'pending')->get();
        $sentCount = 0;
        $failedCount = 0;

        foreach ($pendingLogs as $log) {
            /** @var SmsCampaignLog $log */
            $this->sendSingleSms($smsService, $log, $campaign, $sentCount, $failedCount);
        }

        // Determine final status
        $finalStatus = $failedCount > 0 && $sentCount === 0 ? 'failed' : 'completed';

        // For daily campaigns, calculate next run and keep as scheduled
        if ($campaign->isDaily() && $campaign->is_enabled) {
            $nextRunAt = $campaignService->calculateNextRunAt($campaign);
            $campaign->update([
                'status' => 'scheduled',
                'sent_count' => $campaign->sent_count + $sentCount,
                'failed_count' => $campaign->failed_count + $failedCount,
                'pending_count' => 0,
                'next_run_at' => $nextRunAt,
            ]);
        } else {
            $campaign->update([
                'status' => $finalStatus,
                'sent_count' => $campaign->sent_count + $sentCount,
                'failed_count' => $campaign->failed_count + $failedCount,
                'pending_count' => $campaign->logs()->where('status', 'pending')->count(),
                'next_run_at' => null,
            ]);
        }

        Log::channel('clicksend')->info("Campaign #{$campaign->id} run completed", [
            'sent' => $sentCount,
            'failed' => $failedCount,
            'final_status' => $campaign->status,
        ]);
    }

    private function sendSingleSms(
        ClickSendSmsService $smsService,
        SmsCampaignLog $log,
        SmsCampaign $campaign,
        int &$sentCount,
        int &$failedCount,
    ): void {
        $log->update(['status' => 'queued']);

        try {
            $senderId = $campaign->sender_id ?? config('clicksend.sender_id');

            $result = $smsService->send(
                to: $log->phone_number,
                message: $log->message,
                customString: "campaign_{$campaign->id}_log_{$log->id}"
            );

            $log->update([
                'status' => 'sent',
                'provider_message_id' => $result['message_id'],
                'provider_response' => json_encode($result),
                'sent_at' => now(),
            ]);

            $sentCount++;
        } catch (ClickSendException $e) {
            $log->update([
                'status' => 'failed',
                'error_reason' => $e->getMessage(),
                'provider_response' => $e->getMessage(),
            ]);

            $failedCount++;

            Log::channel('clicksend')->warning("Campaign log #{$log->id} failed", [
                'phone' => $log->phone_number,
                'error' => $e->getMessage(),
            ]);
        } catch (\Throwable $e) {
            $log->update([
                'status' => 'failed',
                'error_reason' => $e->getMessage(),
            ]);

            $failedCount++;

            Log::channel('clicksend')->error("Campaign log #{$log->id} unexpected error", [
                'phone' => $log->phone_number,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
