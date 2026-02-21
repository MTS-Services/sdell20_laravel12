<?php

use App\Exceptions\ClickSendException;
use App\Jobs\ProcessBulkSmsSendJob;
use App\Models\BulkSmsSend;
use App\Models\SmsSendLog;
use App\Models\User;
use App\Services\ClickSendSmsService;

it('processes all pending logs and marks them sent', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $bulkSend = BulkSmsSend::factory()->create([
        'admin_id' => $admin->id,
        'total_numbers' => 2,
        'pending_count' => 2,
    ]);

    SmsSendLog::factory()->count(2)->create([
        'bulk_sms_send_id' => $bulkSend->id,
        'message' => $bulkSend->message,
        'created_by' => $admin->id,
        'status' => 'pending',
    ]);

    $mockService = Mockery::mock(ClickSendSmsService::class);
    $mockService->shouldReceive('send')
        ->twice()
        ->andReturn([
            'message_id' => 'mock_msg_123',
            'status' => 'SUCCESS',
            'status_code' => 200,
        ]);

    app()->instance(ClickSendSmsService::class, $mockService);

    (new ProcessBulkSmsSendJob($bulkSend->id))->handle($mockService);

    $bulkSend->refresh();
    expect($bulkSend->status)->toBe('completed');
    expect($bulkSend->sent_count)->toBe(2);
    expect($bulkSend->failed_count)->toBe(0);

    expect(SmsSendLog::where('status', 'sent')->count())->toBe(2);
});

it('marks failed logs when clicksend throws exception', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $bulkSend = BulkSmsSend::factory()->create([
        'admin_id' => $admin->id,
        'total_numbers' => 1,
        'pending_count' => 1,
    ]);

    SmsSendLog::factory()->create([
        'bulk_sms_send_id' => $bulkSend->id,
        'message' => $bulkSend->message,
        'created_by' => $admin->id,
        'status' => 'pending',
    ]);

    $mockService = Mockery::mock(ClickSendSmsService::class);
    $mockService->shouldReceive('send')
        ->once()
        ->andThrow(new ClickSendException('ClickSend rejected message', 422));

    (new ProcessBulkSmsSendJob($bulkSend->id))->handle($mockService);

    $bulkSend->refresh();
    expect($bulkSend->status)->toBe('completed');
    expect($bulkSend->sent_count)->toBe(0);
    expect($bulkSend->failed_count)->toBe(1);

    $log = SmsSendLog::first();
    expect($log->status)->toBe('failed');
    expect($log->error_reason)->toContain('ClickSend rejected');
});

it('handles mixed success and failure', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $bulkSend = BulkSmsSend::factory()->create([
        'admin_id' => $admin->id,
        'total_numbers' => 2,
        'pending_count' => 2,
    ]);

    SmsSendLog::factory()->count(2)->create([
        'bulk_sms_send_id' => $bulkSend->id,
        'message' => $bulkSend->message,
        'created_by' => $admin->id,
        'status' => 'pending',
    ]);

    $callCount = 0;
    $mockService = Mockery::mock(ClickSendSmsService::class);
    $mockService->shouldReceive('send')
        ->twice()
        ->andReturnUsing(function () use (&$callCount) {
            $callCount++;
            if ($callCount === 1) {
                return [
                    'message_id' => 'mock_msg_success',
                    'status' => 'SUCCESS',
                    'status_code' => 200,
                ];
            }
            throw new ClickSendException('INVALID_RECIPIENT', 422);
        });

    (new ProcessBulkSmsSendJob($bulkSend->id))->handle($mockService);

    $bulkSend->refresh();
    expect($bulkSend->status)->toBe('completed');
    expect($bulkSend->sent_count)->toBe(1);
    expect($bulkSend->failed_count)->toBe(1);
});

it('skips missing bulk send gracefully', function () {
    $mockService = Mockery::mock(ClickSendSmsService::class);
    $mockService->shouldNotReceive('send');

    (new ProcessBulkSmsSendJob(99999))->handle($mockService);

    // Should not throw, just logs and returns
    expect(true)->toBeTrue();
});
