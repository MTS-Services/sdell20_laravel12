<?php

use App\Models\ScheduledSms;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('handles delivery receipt webhook', function () {
    config(['clicksend.webhook_secret' => null]);

    $user = User::factory()->create();
    $sms = ScheduledSms::factory()->create([
        'user_id' => $user->id,
        'status' => 'sent',
        'provider_message_id' => 'msg-12345',
    ]);

    $this->postJson('/api/webhooks/clicksend/delivery', [
        'messageid' => 'msg-12345',
        'status' => 'delivered',
        'customstring' => (string) $sms->id,
    ])->assertOk()
        ->assertContent('OK');

    expect($sms->fresh()->status)->toBe('delivered');
    expect($sms->fresh()->delivered_at)->not->toBeNull();
});

it('updates sms on failed delivery receipt', function () {
    config(['clicksend.webhook_secret' => null]);

    $user = User::factory()->create();
    $sms = ScheduledSms::factory()->create([
        'user_id' => $user->id,
        'status' => 'sent',
        'provider_message_id' => 'msg-12345',
    ]);

    $this->postJson('/api/webhooks/clicksend/delivery', [
        'messageid' => 'msg-12345',
        'status' => 'failed',
        'customstring' => (string) $sms->id,
    ])->assertOk();

    expect($sms->fresh()->last_error)->toContain('failed');
});

it('finds sms by custom string when message id not found', function () {
    config(['clicksend.webhook_secret' => null]);

    $user = User::factory()->create();
    $sms = ScheduledSms::factory()->create([
        'user_id' => $user->id,
        'status' => 'sent',
    ]);

    $this->postJson('/api/webhooks/clicksend/delivery', [
        'messageid' => 'unknown-id',
        'status' => 'delivered',
        'customstring' => (string) $sms->id,
    ])->assertOk();

    expect($sms->fresh()->status)->toBe('delivered');
});

it('rejects webhook with invalid secret', function () {
    config(['clicksend.webhook_secret' => 'super-secret']);

    $this->postJson('/api/webhooks/clicksend/delivery?secret=wrong-secret', [
        'messageid' => 'msg-12345',
        'status' => 'delivered',
    ])->assertStatus(403);
});

it('validates webhook with correct secret', function () {
    config(['clicksend.webhook_secret' => 'super-secret']);

    $user = User::factory()->create();
    $sms = ScheduledSms::factory()->create([
        'user_id' => $user->id,
        'status' => 'sent',
        'provider_message_id' => 'msg-12345',
    ]);

    $this->postJson('/api/webhooks/clicksend/delivery?secret=super-secret', [
        'messageid' => 'msg-12345',
        'status' => 'delivered',
    ])->assertOk();

    expect($sms->fresh()->status)->toBe('delivered');
});

it('allows webhook without secret if not configured', function () {
    config(['clicksend.webhook_secret' => null]);

    $user = User::factory()->create();
    $sms = ScheduledSms::factory()->create([
        'user_id' => $user->id,
        'status' => 'sent',
        'provider_message_id' => 'msg-12345',
    ]);

    $this->postJson('/api/webhooks/clicksend/delivery', [
        'messageid' => 'msg-12345',
        'status' => 'delivered',
    ])->assertOk();
});
