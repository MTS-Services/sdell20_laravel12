<?php

use App\Models\BulkSmsSend;
use App\Models\SmsSendLog;
use App\Models\User;

it('creates a bulk sms send with factory', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $bulkSend = BulkSmsSend::factory()->create(['admin_id' => $admin->id]);

    expect($bulkSend->admin_id)->toBe($admin->id);
    expect($bulkSend->status)->toBe('pending');
});

it('has many sms send logs', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $bulkSend = BulkSmsSend::factory()->create(['admin_id' => $admin->id]);

    SmsSendLog::factory()->count(3)->create([
        'bulk_sms_send_id' => $bulkSend->id,
        'created_by' => $admin->id,
    ]);

    expect($bulkSend->logs)->toHaveCount(3);
});

it('belongs to admin user', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $bulkSend = BulkSmsSend::factory()->create(['admin_id' => $admin->id]);

    expect($bulkSend->admin->id)->toBe($admin->id);
});

it('sms send log belongs to bulk send', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $bulkSend = BulkSmsSend::factory()->create(['admin_id' => $admin->id]);
    $log = SmsSendLog::factory()->create([
        'bulk_sms_send_id' => $bulkSend->id,
        'created_by' => $admin->id,
    ]);

    expect($log->bulkSmsSend->id)->toBe($bulkSend->id);
});

it('sms send log belongs to creator', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $bulkSend = BulkSmsSend::factory()->create(['admin_id' => $admin->id]);
    $log = SmsSendLog::factory()->create([
        'bulk_sms_send_id' => $bulkSend->id,
        'created_by' => $admin->id,
    ]);

    expect($log->creator->id)->toBe($admin->id);
});

it('checks isCompleted status helper', function () {
    $bulkSend = BulkSmsSend::factory()->completed()->create();

    expect($bulkSend->isCompleted())->toBeTrue();
    expect($bulkSend->isProcessing())->toBeFalse();
});

it('checks isProcessing status helper', function () {
    $bulkSend = BulkSmsSend::factory()->processing()->create();

    expect($bulkSend->isProcessing())->toBeTrue();
    expect($bulkSend->isCompleted())->toBeFalse();
});

it('cascades delete from bulk send to logs', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $bulkSend = BulkSmsSend::factory()->create(['admin_id' => $admin->id]);

    SmsSendLog::factory()->count(3)->create([
        'bulk_sms_send_id' => $bulkSend->id,
        'created_by' => $admin->id,
    ]);

    expect(SmsSendLog::count())->toBe(3);

    $bulkSend->delete();

    expect(SmsSendLog::count())->toBe(0);
});
