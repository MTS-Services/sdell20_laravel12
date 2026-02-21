<?php

use App\Console\Commands\DispatchDueSmsCommand;
use App\Models\ScheduledSms;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('dispatches jobs for due sms messages', function () {
    $user = User::factory()->create();

    // Create SMS due 5 minutes ago
    ScheduledSms::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'scheduled_at' => now()->subMinutes(5),
    ]);

    // Create SMS due in 5 minutes (should not dispatch)
    ScheduledSms::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'scheduled_at' => now()->addMinutes(5),
    ]);

    // Create SMS already sent (should not dispatch)
    ScheduledSms::factory()->create([
        'user_id' => $user->id,
        'status' => 'sent',
        'scheduled_at' => now()->subMinutes(5),
    ]);

    $command = new DispatchDueSmsCommand;

    $this->artisan('sms:dispatch-due')
        ->expectsOutputToContain('Found 1 due SMS messages')
        ->assertSuccessful();
});

it('respects max attempts limit', function () {
    $user = User::factory()->create();

    // Create SMS that has reached max attempts
    ScheduledSms::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'attempts' => 3,
        'max_attempts' => 3,
        'scheduled_at' => now()->subMinutes(5),
    ]);

    $this->artisan('sms:dispatch-due')
        ->expectsOutputToContain('Found 0 due SMS messages')
        ->assertSuccessful();
});

it('limits dispatch to 200 messages per run', function () {
    $user = User::factory()->create();

    // Create 250 due SMS messages
    ScheduledSms::factory(250)->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'scheduled_at' => now()->subMinutes(5),
    ]);

    $this->artisan('sms:dispatch-due')
        ->expectsOutputToContain('Found 200 due SMS messages')
        ->assertSuccessful();
});
