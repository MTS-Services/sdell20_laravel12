<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\ScheduledSms;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class ClickSendDeliveryController extends Controller
{
    public function __invoke(Request $request): Response
    {
        if (config('clicksend.webhook_secret')) {
            abort_unless(
                $request->query('secret') === config('clicksend.webhook_secret'),
                403,
                'Invalid webhook secret'
            );
        }

        $payload = $request->all();

        Log::channel('clicksend')->info('ClickSend delivery receipt', [
            'message_id' => $payload['messageid'] ?? null,
            'status' => $payload['status'] ?? null,
            'custom' => $payload['customstring'] ?? null,
        ]);

        $messageId = $payload['messageid'] ?? null;
        $customString = $payload['customstring'] ?? null;
        $status = strtolower($payload['status'] ?? '');

        $sms = ScheduledSms::where('provider_message_id', $messageId)->first()
            ?? ScheduledSms::find($customString);

        if ($sms) {
            if ($status === 'delivered') {
                $sms->update([
                    'status' => 'delivered',
                    'delivered_at' => now(),
                ]);
            } elseif (in_array($status, ['failed', 'undelivered', 'expired'], true)) {
                $sms->update([
                    'last_error' => "Delivery failed: {$status}",
                ]);
            }
        }

        return response('OK', 200);
    }
}
