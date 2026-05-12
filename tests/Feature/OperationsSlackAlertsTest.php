<?php

use App\Mail\LpaCompletedAdminEmail;
use App\Mail\LpaCompletedEmail;
use App\Mail\PaymentCompletedEmail;
use App\Models\Lpa;
use App\Models\Payment;
use App\Models\User;
use App\Notifications\LpaMarkedPaidSlackNotification;
use App\Services\Payment\PaymentIntentClientInterface;
use App\Support\OperationsSlack;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    config([
        'services.slack.notifications.bot_user_oauth_token' => 'xoxb-test-token',
        'services.slack.notifications.channel' => '#test-ops',
    ]);
});

it('does not send slack when payment is confirmed but queues receipt email', function (): void {
    Notification::fake();
    Mail::fake();

    $user = User::factory()->create();
    Payment::factory()->pending()->create([
        'user_id' => $user->id,
        'stripe_payment_intent_id' => 'pi_slack_test_1',
    ]);

    $fakeIntent = (object) [
        'id' => 'pi_slack_test_1',
        'status' => 'succeeded',
    ];

    $this->mock(PaymentIntentClientInterface::class, function ($mock) use ($fakeIntent): void {
        $mock->shouldReceive('retrieve')
            ->with('pi_slack_test_1')
            ->once()
            ->andReturn($fakeIntent);
    });

    $this->actingAs($user)->postJson('/payment/confirm', [
        'payment_intent_id' => 'pi_slack_test_1',
    ])->assertOk();

    Notification::assertNothingSent();
    Mail::assertQueued(PaymentCompletedEmail::class);
});

it('does not send slack or lpa draft mail when an lpa draft is stored', function (): void {
    Notification::fake();
    Mail::fake();

    $user = User::factory()->create(['email_verified_at' => now()]);

    $payload = [
        'who_for' => 'Me',
        'document_type' => 'health',
        'donor_details' => [
            'title' => 'Ms',
            'firstName' => 'Jane',
            'lastName' => 'Doe',
            'middleNames' => '',
            'birthDay' => '1',
            'birthMonth' => '1',
            'birthYear' => '1980',
        ],
        'contact_details' => [
            'addressLine1' => '1 Main St',
            'town' => 'London',
            'postcode' => 'SW1A 1AA',
            'email' => 'jane@example.com',
        ],
        'attorneys' => [],
        'can_view_documents' => false,
        'replacement_attorneys' => [],
        'want_replacement_attorneys' => false,
        'life_sustaining_treatment' => false,
        'notify_people' => false,
        'applicant' => 'donor',
        'document_recipient' => 'donor',
        'certificate_choice' => false,
        'lp1h_form' => [],
    ];

    $this->actingAs($user)->postJson(route('lpas.store'), $payload)->assertCreated();

    Notification::assertNothingSent();
    Mail::assertNothingQueued();
});

it('queues slack when an lpa is marked paid', function (): void {
    Notification::fake();
    Mail::fake();

    $user = User::factory()->create([
        'name' => 'Pat Customer',
        'email' => 'pat@example.test',
    ]);

    $lpa = Lpa::query()->create([
        'user_id' => $user->id,
        'who_for' => 'Me',
        'document_type' => 'health',
        'status' => 'draft',
        'donor_details' => ['firstName' => 'Test'],
        'contact_details' => ['email' => 'donor@example.com'],
        'is_draft' => true,
        'amount' => 118.8,
    ]);

    $lpa->markAsPaid('pi_mark_paid_1');

    Mail::assertQueued(LpaCompletedEmail::class);
    Mail::assertQueued(LpaCompletedAdminEmail::class);

    Notification::assertSentOnDemand(LpaMarkedPaidSlackNotification::class, function (LpaMarkedPaidSlackNotification $notification) use ($lpa): bool {
        $payload = json_encode($notification->toSlack(new \stdClass)->toArray(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        expect($payload)
            ->toContain('Pat Customer')
            ->toContain('pat@example.test')
            ->toContain('Paid (completed)')
            ->toContain('£118.80')
            ->toContain((string) $lpa->getKey())
            ->toContain('pi_mark_paid_1');

        return true;
    });
});

it('is configured when only slack webhook url is set', function (): void {
    config([
        'services.slack.notifications.webhook_url' => 'https://hooks.slack.com/services/T000/B000/XXXXXXXXXXXXXXXX',
        'services.slack.notifications.bot_user_oauth_token' => null,
        'services.slack.notifications.channel' => null,
    ]);

    expect(OperationsSlack::isConfigured())->toBeTrue();
});

it('does not send slack when bot token is not configured', function (): void {
    config([
        'services.slack.notifications.bot_user_oauth_token' => null,
        'services.slack.notifications.channel' => '#ignored',
        'services.slack.notifications.webhook_url' => null,
    ]);

    Notification::fake();

    $user = User::factory()->create();
    Payment::factory()->pending()->create([
        'user_id' => $user->id,
        'stripe_payment_intent_id' => 'pi_no_slack_1',
    ]);

    $fakeIntent = (object) [
        'id' => 'pi_no_slack_1',
        'status' => 'succeeded',
    ];

    $this->mock(PaymentIntentClientInterface::class, function ($mock) use ($fakeIntent): void {
        $mock->shouldReceive('retrieve')->once()->andReturn($fakeIntent);
    });

    $this->actingAs($user)->postJson('/payment/confirm', [
        'payment_intent_id' => 'pi_no_slack_1',
    ])->assertOk();

    Notification::assertNothingSent();
});
