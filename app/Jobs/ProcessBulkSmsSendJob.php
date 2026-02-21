<?php

namespace App\Jobs;

use App\Exceptions\ClickSendException;
use App\Models\BulkSmsSend;
use App\Models\SmsSendLog;
use App\Services\ClickSendSmsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessBulkSmsSendJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;

    public int $timeout = 600;

    public function __construct(private readonly int $bulkSmsSendId) {}

    public function handle(ClickSendSmsService $smsService): void
    {
        /** @var BulkSmsSend|null $bulkSend */
        $bulkSend = BulkSmsSend::find($this->bulkSmsSendId);

        if (! $bulkSend) {
            Log::channel('clicksend')->warning("BulkSmsSend #{$this->bulkSmsSendId} not found, skipping.");

            return;
        }

        $bulkSend->update(['status' => 'processing']);

        $pendingLogs = $bulkSend->logs()->where('status', 'pending')->get();
        $sentCount = 0;
        $failedCount = 0;

        foreach ($pendingLogs as $log) {
            /** @var SmsSendLog $log */
            $this->sendSingleSms($smsService, $log, $sentCount, $failedCount);
        }

        $bulkSend->update([
            'status' => 'completed',
            'sent_count' => $bulkSend->sent_count + $sentCount,
            'failed_count' => $bulkSend->failed_count + $failedCount,
            'pending_count' => $bulkSend->logs()->where('status', 'pending')->count(),
        ]);

        Log::channel('clicksend')->info("BulkSmsSend #{$bulkSend->id} completed", [
            'sent' => $sentCount,
            'failed' => $failedCount,
        ]);
    }

    private function sendSingleSms(
        ClickSendSmsService $smsService,
        SmsSendLog $log,
        int &$sentCount,
        int &$failedCount
    ): void {
        $log->update(['status' => 'queued']);

        try {
            $result = $smsService->send(
                to: $log->phone_number,
                message: $log->message,
                customString: "bulk_{$log->bulk_sms_send_id}_log_{$log->id}"
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

            Log::channel('clicksend')->warning("BulkSMS log #{$log->id} failed", [
                'phone' => $log->phone_number,
                'error' => $e->getMessage(),
            ]);
        } catch (\Throwable $e) {
            $log->update([
                'status' => 'failed',
                'error_reason' => $e->getMessage(),
                'provider_response' => $e->getMessage(),
            ]);

            $failedCount++;

            Log::channel('clicksend')->error("BulkSMS log #{$log->id} unexpected error", [
                'phone' => $log->phone_number,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
