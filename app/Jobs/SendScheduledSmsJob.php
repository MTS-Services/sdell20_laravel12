<?php

namespace App\Jobs;

use App\Exceptions\ClickSendException;
use App\Models\ScheduledSms;
use App\Services\ClickSendSmsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendScheduledSmsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;

    public int $timeout = 30;

    public function __construct(private readonly int $scheduledSmsId) {}

    public function handle(ClickSendSmsService $smsService): void
    {
        /** @var ScheduledSms|null $sms */
        $sms = ScheduledSms::find($this->scheduledSmsId);

        if (! $sms) {
            Log::warning("ScheduledSms #{$this->scheduledSmsId} not found, skipping.");

            return;
        }

        if (! $sms->isPending()) {
            Log::info("ScheduledSms #{$sms->id} is already {$sms->status}, skipping.");

            return;
        }

        $sms->update(['status' => 'processing', 'attempts' => $sms->attempts + 1]);

        try {
            $result = $smsService->send(
                to: $sms->to_phone,
                message: $sms->message,
                customString: (string) $sms->id
            );

            $sms->update([
                'status' => 'sent',
                'provider_message_id' => $result['message_id'],
                'sent_at' => now(),
                'last_error' => null,
            ]);

        } catch (ClickSendException $e) {
            $this->handleFailure($sms, $e->getMessage());
        } catch (\Throwable $e) {
            Log::channel('clicksend')->error("Unexpected error for ScheduledSms #{$sms->id}", [
                'error' => $e->getMessage(),
            ]);
            $this->handleFailure($sms, $e->getMessage());
        }
    }

    private function handleFailure(ScheduledSms $sms, string $error): void
    {
        $newStatus = $sms->attempts >= $sms->max_attempts ? 'failed' : 'pending';

        $sms->update([
            'status' => $newStatus,
            'last_error' => $error,
        ]);

        Log::channel('clicksend')->warning("ScheduledSms #{$sms->id} attempt {$sms->attempts} failed", [
            'status' => $newStatus,
            'error' => $error,
        ]);
    }
}
