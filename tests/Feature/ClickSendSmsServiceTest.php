<?php

use App\Exceptions\ClickSendException;
use App\Services\ClickSendSmsService;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    config([
        'clicksend.base_url' => 'https://rest.clicksend.com/v3',
        'clicksend.username' => 'test@example.com',
        'clicksend.api_key' => 'test-api-key',
        'clicksend.sender_id' => 'TestApp',
        'clicksend.timeout' => 10,
    ]);
});

it('sends sms successfully', function () {
    Http::fake([
        'rest.clicksend.com/v3/sms/send' => Http::response([
            'http_code' => 200,
            'response_code' => 'SUCCESS',
            'response_msg' => 'Messages queued for delivery.',
            'data' => [
                'total_price' => 0.07,
                'total_count' => 1,
                'queued_count' => 1,
                'messages' => [
                    [
                        'to' => '+8801712345678',
                        'body' => 'Test message',
                        'status' => 'SUCCESS',
                        'message_id' => 'msg-abc-123',
                    ],
                ],
            ],
        ], 200),
    ]);

    $service = new ClickSendSmsService;
    $result = $service->send('+8801712345678', 'Test message');

    expect($result['message_id'])->toBe('msg-abc-123');
    expect($result['status'])->toBe('SUCCESS');
    expect($result['status_code'])->toBe(200);

    Http::assertSent(function ($request) {
        return str_contains($request->url(), '/sms/send')
            && $request['messages'][0]['to'] === '+8801712345678'
            && $request['messages'][0]['body'] === 'Test message'
            && $request['messages'][0]['from'] === 'TestApp';
    });
});

it('throws exception on authentication failure', function () {
    Http::fake([
        'rest.clicksend.com/v3/sms/send' => Http::response([
            'http_code' => 401,
            'response_code' => 'UNAUTHORIZED',
            'response_msg' => 'Authentication failed.',
        ], 401),
    ]);

    $service = new ClickSendSmsService;
    $service->send('+8801712345678', 'Test message');
})->throws(ClickSendException::class, 'ClickSend authentication failed');

it('throws exception on api error', function () {
    Http::fake([
        'rest.clicksend.com/v3/sms/send' => Http::response([
            'http_code' => 500,
            'response_code' => 'INTERNAL_ERROR',
            'response_msg' => 'Internal server error',
        ], 500),
    ]);

    $service = new ClickSendSmsService;
    $service->send('+8801712345678', 'Test message');
})->throws(ClickSendException::class, 'ClickSend error: Internal server error');

it('throws exception on per-message failure', function () {
    Http::fake([
        'rest.clicksend.com/v3/sms/send' => Http::response([
            'http_code' => 200,
            'response_code' => 'SUCCESS',
            'data' => [
                'messages' => [
                    [
                        'to' => '+8801712345678',
                        'body' => 'Test',
                        'status' => 'INVALID_RECIPIENT',
                        'message_id' => null,
                    ],
                ],
            ],
        ], 200),
    ]);

    $service = new ClickSendSmsService;
    $service->send('+8801712345678', 'Test');
})->throws(ClickSendException::class, 'INVALID_RECIPIENT');

it('passes custom string in payload', function () {
    Http::fake([
        'rest.clicksend.com/v3/sms/send' => Http::response([
            'data' => [
                'messages' => [
                    [
                        'status' => 'SUCCESS',
                        'message_id' => 'msg-456',
                    ],
                ],
            ],
        ], 200),
    ]);

    $service = new ClickSendSmsService;
    $result = $service->send('+8801712345678', 'Test', '42');

    Http::assertSent(function ($request) {
        return $request['messages'][0]['custom_string'] === '42';
    });

    expect($result['message_id'])->toBe('msg-456');
});
