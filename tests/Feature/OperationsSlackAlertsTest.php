<?php

use App\Mail\LpaCompletedAdminEmail;
use App\Mail\LpaCompletedEmail;
use App\Mail\PaymentCompletedEmail;
use App\Models\Lpa;
use App\Models\Payment;
use App\Models\User;
use App\Notifications\ContactFormSubmittedSlackNotification;
use App\Notifications\LpaMarkedPaidSlackNotification;
use App\Notifications\PaymentSubmittedSlackNotification;
use App\Services\Payment\PaymentIntentClientInterface;
use App\Support\MailChannelOnlyNotification;
use App\Support\OperationsSlack;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    config([
        'services.slack.notifications.bot_user_oauth_token' => 'xoxb-test-token',
        'services.slack.notifications.channel' => '#test-ops',
        'services.slack.notifications.channels.lpa' => null,
        'services.slack.notifications.channels.will' => null,
        'services.slack.notifications.channels.contact' => null,
        'services.slack.notifications.channels.payment' => null,
        'services.slack.notifications.mirror_email' => null,
    ]);
});

it('queues pay page slack and receipt email when a payment is confirmed', function (): void {
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

    Mail::assertQueued(PaymentCompletedEmail::class);
    Notification::assertSentOnDemand(PaymentSubmittedSlackNotification::class, function (PaymentSubmittedSlackNotification $notification): bool {
        $payload = json_encode($notification->toSlack(new \stdClass)->toArray(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        expect($payload)
            ->toContain('Pay Page Submitted')
            ->toContain('pi_slack_test_1');

        return true;
    });
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

it('routes the lpa notification to its own slack channel when configured', function (): void {
    config([
        'services.slack.notifications.channels.lpa' => 'C9LPA12345',
    ]);

    Notification::fake();
    Mail::fake();

    $user = User::factory()->create();
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

    $lpa->markAsPaid('pi_lpa_channel');

    Notification::assertSentOnDemand(LpaMarkedPaidSlackNotification::class, function (
        LpaMarkedPaidSlackNotification $notification,
        array $channels,
        \Illuminate\Notifications\AnonymousNotifiable $notifiable
    ): bool {
        return in_array('slack', $channels, true)
            && $notifiable->routeNotificationFor('slack') === 'C9LPA12345';
    });
});

it('also mirrors the will notification to the configured mirror email', function (): void {
    config([
        'services.slack.notifications.mirror_email' => 'd22509384@gmail.com',
    ]);

    Notification::fake();
    Mail::fake();

    $user = User::factory()->create([
        'name' => 'Will Customer',
        'email' => 'will@example.test',
    ]);

    $will = \App\Models\Will::query()->create([
        'user_id' => $user->id,
        'will_type' => 'Me',
        'status' => 'draft',
        'is_draft' => true,
        'amount' => 83.99,
    ]);

    $will->markAsPaid('pi_will_mirror');

    Notification::assertSentOnDemand(MailChannelOnlyNotification::class, function (
        MailChannelOnlyNotification $notification,
        array $channels,
        \Illuminate\Notifications\AnonymousNotifiable $notifiable
    ): bool {
        return in_array('mail', $channels, true)
            && $notifiable->routeNotificationFor('mail') === 'd22509384@gmail.com'
            && $notification->wrappedNotification() instanceof \App\Notifications\WillMarkedPaidSlackNotification;
    });

    Notification::assertSentOnDemand(\App\Notifications\WillMarkedPaidSlackNotification::class);
});

it('sends a contact page form slack notification when the contact form is submitted', function (): void {
    Notification::fake();
    Mail::fake();

    $this->postJson(route('contact.submit'), [
        'firstName' => 'Jane',
        'lastName' => 'Doe',
        'email' => 'jane@example.com',
        'phone' => '+44 7000 000000',
        'message' => 'Hello there',
    ])->assertRedirect();

    Notification::assertSentOnDemand(\App\Notifications\ContactFormSubmittedSlackNotification::class, function (
        \App\Notifications\ContactFormSubmittedSlackNotification $notification
    ): bool {
        $payload = json_encode($notification->toSlack(new \stdClass)->toArray(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        expect($payload)
            ->toContain('Contact Page Form')
            ->toContain('Jane Doe')
            ->toContain('jane@example.com')
            ->toContain('Hello there');

        return true;
    });
});

it('uses the bot default channel before the global webhook when a dedicated SLACK_CHANNEL_* is unset', function (): void {
    config([
        'services.slack.notifications.bot_user_oauth_token' => 'xoxb-test-token',
        'services.slack.notifications.channel' => '#from-bot-default',
        'services.slack.notifications.webhook_url' => 'https://hooks.slack.com/services/T000/B000/XXXXXXXXXXXXXXXX',
        'services.slack.notifications.channels.contact' => null,
    ]);

    Notification::fake();
    Mail::fake();

    $this->postJson(route('contact.submit'), [
        'firstName' => 'Jane',
        'lastName' => 'Doe',
        'email' => 'jane@example.com',
        'phone' => '+44 7000 000000',
        'message' => 'Routing test',
    ])->assertRedirect();

    Notification::assertSentOnDemand(ContactFormSubmittedSlackNotification::class, function (
        ContactFormSubmittedSlackNotification $notification,
        array $channels,
        \Illuminate\Notifications\AnonymousNotifiable $notifiable
    ): bool {
        return $notifiable->routeNotificationFor('slack') === '#from-bot-default';
    });
});
