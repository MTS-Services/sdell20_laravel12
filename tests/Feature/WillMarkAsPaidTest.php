<?php

use App\Mail\WillCompletedAdminEmail;
use App\Mail\WillCompletedEmail;
use App\Models\User;
use App\Models\Will;
use App\Notifications\WillMarkedPaidSlackNotification;
use App\Services\WillPdfService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    config([
        'services.slack.notifications.bot_user_oauth_token' => 'xoxb-test-token',
        'services.slack.notifications.channel' => '#test-ops',
        'mail.will_completed_admin_address' => 'ops-admin@example.test',
        'mail.will_completed_admin_cc' => [],
    ]);
});

it('queues customer and admin emails and slack once when a draft will is marked paid', function (): void {
    Notification::fake();
    Mail::fake();

    $user = User::factory()->create([
        'name' => 'Will Customer',
        'email' => 'will-customer@example.test',
    ]);

    $will = Will::query()->create([
        'user_id' => $user->id,
        'will_type' => 'Me',
        'status' => 'draft',
        'is_draft' => true,
        'amount' => 83.99,
    ]);

    $will->markAsPaid('pi_will_1');

    Mail::assertQueued(WillCompletedEmail::class, 1);
    Mail::assertQueued(WillCompletedAdminEmail::class, 1);

    Notification::assertSentOnDemand(WillMarkedPaidSlackNotification::class, function (WillMarkedPaidSlackNotification $notification) use ($will): bool {
        $payload = json_encode($notification->toSlack(new \stdClass)->toArray(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        expect($payload)
            ->toContain('Will Customer')
            ->toContain('will-customer@example.test')
            ->toContain('Paid (completed)')
            ->toContain('£83.99')
            ->toContain((string) $will->getKey())
            ->toContain('pi_will_1');

        return true;
    });
});

it('does not queue duplicate completion emails when mark as paid runs more than once', function (): void {
    Notification::fake();
    Mail::fake();

    $user = User::factory()->create(['email' => 'repeat@example.test']);

    $will = Will::query()->create([
        'user_id' => $user->id,
        'will_type' => 'Mirror',
        'status' => 'draft',
        'is_draft' => true,
        'amount' => 99.99,
    ]);

    $will->markAsPaid('pi_first');
    $will->markAsPaid('pi_second');
    $will->markAsPaid('pi_third');

    Mail::assertQueued(WillCompletedEmail::class, 1);
    Mail::assertQueued(WillCompletedAdminEmail::class, 1);
    Notification::assertSentOnDemandTimes(WillMarkedPaidSlackNotification::class, 1);
});

it('rejects applying the same payment reference to a second will for the same user', function (): void {
    Notification::fake();
    Mail::fake();

    config([
        'services.slack.notifications.bot_user_oauth_token' => 'xoxb-test-token',
        'services.slack.notifications.channel' => '#test-ops',
        'mail.will_completed_admin_address' => 'ops-admin@example.test',
        'mail.will_completed_admin_cc' => [],
    ]);

    $this->mock(WillPdfService::class, function ($mock): void {
        $mock->shouldReceive('removeDraftWatermark')->once()->andReturn(null);
    });

    $user = User::factory()->create(['email_verified_at' => now()]);

    $willA = Will::query()->create([
        'user_id' => $user->id,
        'will_type' => 'Me',
        'status' => 'draft',
        'is_draft' => true,
        'amount' => 78.00,
    ]);

    $willB = Will::query()->create([
        'user_id' => $user->id,
        'will_type' => 'Me',
        'status' => 'draft',
        'is_draft' => true,
        'amount' => 78.00,
    ]);

    $payload = [
        'payment_reference' => '1',
        'payment_method' => 'stripe',
    ];

    $this->actingAs($user)->postJson(route('wills.payment', $willA), $payload)->assertOk();
    $this->actingAs($user)->postJson(route('wills.payment', $willB), $payload)->assertUnprocessable();

    Mail::assertQueued(WillCompletedEmail::class, 1);
    Mail::assertQueued(WillCompletedAdminEmail::class, 1);
    Notification::assertSentOnDemandTimes(WillMarkedPaidSlackNotification::class, 1);
});
