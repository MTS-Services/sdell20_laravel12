<?php

namespace App\Services;

use App\Exceptions\ClickSendException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ClickSendSmsService
{
    private string $baseUrl;

    private string $username;

    private string $apiKey;

    private string $senderId;

    public function __construct()
    {
        $this->baseUrl = config('clicksend.base_url');
        $this->username = config('clicksend.username');
        $this->apiKey = config('clicksend.api_key');
        $this->senderId = config('clicksend.sender_id');
    }

    /**
     * Send a single SMS message.
     *
     * @return array{message_id: string, status: string, status_code: int}
     *
     * @throws ClickSendException
     */
    public function send(string $to, string $message, ?string $customString = null): array
    {
        $payload = [
            'messages' => [
                [
                    'source' => 'laravel-app',
                    'body' => $message,
                    'to' => $to,
                    'from' => $this->senderId,
                    'custom_string' => $customString ?? '',
                ],
            ],
        ];

        Log::channel('clicksend')->info('ClickSend SMS outbound', [
            'to' => $to,
            'message_length' => strlen($message),
            'custom_string' => $customString,
        ]);

        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::timeout(config('clicksend.timeout'))
            ->withBasicAuth($this->username, $this->apiKey)
            ->acceptJson()
            ->post("{$this->baseUrl}/sms/send", $payload);

        return $this->parseResponse($response, $to);
    }

    private function parseResponse(Response $response, string $to): array
    {
        if ($response->status() === 401) {
            throw new ClickSendException('ClickSend authentication failed. Check your credentials.', 401);
        }

        if (! $response->successful()) {
            $body = $response->json();
            $errorMsg = $body['response_msg'] ?? 'Unknown ClickSend error';
            Log::channel('clicksend')->error('ClickSend API error', [
                'status' => $response->status(),
                'response_msg' => $errorMsg,
            ]);
            throw new ClickSendException("ClickSend error: {$errorMsg}", $response->status());
        }

        $data = $response->json();
        $messageData = $data['data']['messages'][0] ?? [];
        $apiStatus = $messageData['status'] ?? 'UNKNOWN';

        // ClickSend returns HTTP 200 even for per-message failures
        if (! in_array($apiStatus, ['SUCCESS', 'QUEUED'], true)) {
            throw new ClickSendException(
                "ClickSend rejected message to {$to}: {$apiStatus}",
                422
            );
        }

        Log::channel('clicksend')->info('ClickSend SMS accepted', [
            'to' => $to,
            'message_id' => $messageData['message_id'] ?? null,
            'status' => $apiStatus,
        ]);

        return [
            'message_id' => $messageData['message_id'] ?? null,
            'status' => $apiStatus,
            'status_code' => $response->status(),
        ];
    }
}
