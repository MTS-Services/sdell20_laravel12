<?php

use App\Models\ScheduledSms;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('creates a scheduled sms factory', function () {
    $sms = ScheduledSms::factory()->create();

    expect($sms->id)->toBeInt();
    expect($sms->to_phone)->toMatch('/^\+[1-9]\d{6,14}$/');
    expect($sms->message)->toBeString();
    expect($sms->status)->toBe('pending');
});

it('generates unique idempotency keys', function () {
    $sms1 = ScheduledSms::factory()->create([
        'to_phone' => '+8801712345678',
        'message' => 'Test',
        'scheduled_at' => now(),
    ]);

    $sms2 = ScheduledSms::factory()->create([
        'to_phone' => '+8801712345679',
        'message' => 'Test',
        'scheduled_at' => now(),
    ]);

    expect($sms1->idempotency_key)->not->toBe($sms2->idempotency_key);
});

it('tracks delivery status', function () {
    $sms = ScheduledSms::factory()->create();

    expect($sms->status)->toBe('pending');
    expect($sms->delivered_at)->toBeNull();

    $sms->update([
        'status' => 'delivered',
        'delivered_at' => now(),
    ]);

    expect($sms->status)->toBe('delivered');
    expect($sms->delivered_at)->not->toBeNull();
});

it('belongs to user', function () {
    $user = User::factory()->create();
    $sms = ScheduledSms::factory()->create(['user_id' => $user->id]);

    expect($sms->user->id)->toBe($user->id);
});

it('nullifies user_id when user is deleted', function () {
    $user = User::factory()->create();
    $sms = ScheduledSms::factory()->create(['user_id' => $user->id]);

    $user->delete();

    expect(ScheduledSms::find($sms->id)->user_id)->toBeNull();
});
