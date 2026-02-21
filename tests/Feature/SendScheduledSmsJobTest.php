<?php

use App\Exceptions\ClickSendException;
use App\Jobs\SendScheduledSmsJob;
use App\Models\ScheduledSms;
use App\Models\User;
use App\Services\ClickSendSmsService;

it('dispatches job for a pending sms', function () {
    $user = User::factory()->create();
    $sms = ScheduledSms::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
    ]);

    $this->mock(ClickSendSmsService::class, function ($mock) use ($sms) {
        $mock->shouldReceive('send')
            ->once()
            ->with($sms->to_phone, $sms->message, (string) $sms->id)
            ->andReturn([
                'message_id' => 'msg-123',
                'status' => 'SUCCESS',
                'status_code' => 200,
            ]);
    });

    $job = new SendScheduledSmsJob($sms->id);
    $job->handle(app(ClickSendSmsService::class));

    expect($sms->fresh()->status)->toBe('sent');
    expect($sms->fresh()->provider_message_id)->toBe('msg-123');
    expect($sms->fresh()->sent_at)->not->toBeNull();
});

it('marks sms as pending for retry when service throws exception', function () {
    $user = User::factory()->create();
    $sms = ScheduledSms::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'attempts' => 0,
        'max_attempts' => 3,
    ]);

    $this->mock(ClickSendSmsService::class, function ($mock) {
        $mock->shouldReceive('send')->andThrow(
            new ClickSendException('Authentication failed', 401)
        );
    });

    $job = new SendScheduledSmsJob($sms->id);
    $job->handle(app(ClickSendSmsService::class));

    expect($sms->fresh()->status)->toBe('pending');
    expect($sms->fresh()->attempts)->toBe(1);
    expect($sms->fresh()->last_error)->toContain('Authentication failed');
});

it('marks sms as failed after max attempts', function () {
    $user = User::factory()->create();
    $sms = ScheduledSms::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'attempts' => 2,
        'max_attempts' => 3,
    ]);

    $this->mock(ClickSendSmsService::class, function ($mock) {
        $mock->shouldReceive('send')->andThrow(
            new ClickSendException('Network error', 500)
        );
    });

    $job = new SendScheduledSmsJob($sms->id);
    $job->handle(app(ClickSendSmsService::class));

    expect($sms->fresh()->status)->toBe('failed');
    expect($sms->fresh()->attempts)->toBe(3);
});

it('skips processing for non-pending sms', function () {
    $user = User::factory()->create();
    $sms = ScheduledSms::factory()->create([
        'user_id' => $user->id,
        'status' => 'sent',
    ]);

    $this->mock(ClickSendSmsService::class, function ($mock) {
        $mock->shouldNotReceive('send');
    });

    $job = new SendScheduledSmsJob($sms->id);
    $job->handle(app(ClickSendSmsService::class));

    expect($sms->fresh()->status)->toBe('sent');
});

it('handles missing scheduled sms gracefully', function () {
    $this->mock(ClickSendSmsService::class, function ($mock) {
        $mock->shouldNotReceive('send');
    });

    $job = new SendScheduledSmsJob(99999);
    $job->handle(app(ClickSendSmsService::class));

    expect(true)->toBeTrue();
});
