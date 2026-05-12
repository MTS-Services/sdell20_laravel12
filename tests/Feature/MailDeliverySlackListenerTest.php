<?php

use App\Listeners\SendMailDeliveryConfirmationToSlack;
use App\Mail\PaymentCompletedEmail;
use App\Mail\WelcomeEmail;
use App\Notifications\MailDeliveredSlackNotification;
use Illuminate\Mail\Events\MessageSent;
use Illuminate\Mail\SentMessage as IlluminateSentMessage;
use Illuminate\Support\Facades\Notification;
use Symfony\Component\Mailer\Envelope;
use Symfony\Component\Mailer\SentMessage as SymfonySentMessage;
use Symfony\Component\Mime\Email;

it('sends a slack confirmation when an allowlisted mailable has been sent', function (): void {
    config([
        'services.slack.notifications.bot_user_oauth_token' => 'xoxb-test',
        'services.slack.notifications.channel' => '#alerts',
        'services.slack.notifications.webhook_url' => null,
        'services.slack.notifications.mail_delivery_alerts' => true,
        'services.slack.notifications.mail_delivery_alert_mailables' => [
            PaymentCompletedEmail::class,
        ],
    ]);

    Notification::fake();

    $email = (new Email)
        ->from('app@example.com')
        ->to('customer@example.com')
        ->subject('Payment completed successfully - Test')
        ->text('Body');

    $symfonySent = new SymfonySentMessage($email, Envelope::create($email));
    $sent = new IlluminateSentMessage($symfonySent);
    $event = new MessageSent($sent, ['__laravel_mailable' => PaymentCompletedEmail::class]);

    app(SendMailDeliveryConfirmationToSlack::class)->handle($event);

    Notification::assertSentOnDemand(MailDeliveredSlackNotification::class);
});

it('does not send slack delivery confirmation for mailables outside the allowlist', function (): void {
    config([
        'services.slack.notifications.bot_user_oauth_token' => 'xoxb-test',
        'services.slack.notifications.channel' => '#alerts',
        'services.slack.notifications.webhook_url' => null,
        'services.slack.notifications.mail_delivery_alerts' => true,
        'services.slack.notifications.mail_delivery_alert_mailables' => [
            PaymentCompletedEmail::class,
        ],
    ]);

    Notification::fake();

    $email = (new Email)
        ->from('app@example.com')
        ->to('user@example.com')
        ->subject('Welcome')
        ->text('Body');

    $symfonySent = new SymfonySentMessage($email, Envelope::create($email));
    $sent = new IlluminateSentMessage($symfonySent);
    $event = new MessageSent($sent, ['__laravel_mailable' => WelcomeEmail::class]);

    app(SendMailDeliveryConfirmationToSlack::class)->handle($event);

    Notification::assertNothingSent();
});

it('does not send slack delivery confirmation when mail_delivery_alerts is disabled', function (): void {
    config([
        'services.slack.notifications.bot_user_oauth_token' => 'xoxb-test',
        'services.slack.notifications.channel' => '#alerts',
        'services.slack.notifications.webhook_url' => null,
        'services.slack.notifications.mail_delivery_alerts' => false,
        'services.slack.notifications.mail_delivery_alert_mailables' => [
            PaymentCompletedEmail::class,
        ],
    ]);

    Notification::fake();

    $email = (new Email)
        ->from('app@example.com')
        ->to('customer@example.com')
        ->subject('Payment completed successfully - Test')
        ->text('Body');

    $symfonySent = new SymfonySentMessage($email, Envelope::create($email));
    $sent = new IlluminateSentMessage($symfonySent);
    $event = new MessageSent($sent, ['__laravel_mailable' => PaymentCompletedEmail::class]);

    app(SendMailDeliveryConfirmationToSlack::class)->handle($event);

    Notification::assertNothingSent();
});
