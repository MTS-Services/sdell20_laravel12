<?php

namespace App\Listeners;

use App\Notifications\MailDeliveredSlackNotification;
use App\Support\OperationsSlack;
use Illuminate\Mail\Events\MessageSent;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;

class SendMailDeliveryConfirmationToSlack
{
    public function handle(MessageSent $event): void
    {
        if (! config('services.slack.notifications.mail_delivery_alerts', true)) {
            return;
        }

        if (! OperationsSlack::isConfigured()) {
            return;
        }

        $mailableClass = $event->data['__laravel_mailable'] ?? null;

        if (! is_string($mailableClass)) {
            return;
        }

        /** @var list<string> $allowlist */
        $allowlist = config('services.slack.notifications.mail_delivery_alert_mailables', []);

        if ($allowlist === []) {
            return;
        }

        if (! in_array($mailableClass, $allowlist, true)) {
            return;
        }

        $message = $event->message;

        if (! $message instanceof Email) {
            return;
        }

        $subject = $message->getSubject() ?? '(no subject)';
        $to = self::formatAddresses($message->getTo());
        $cc = self::formatAddresses($message->getCc());

        OperationsSlack::notify(new MailDeliveredSlackNotification(
            mailableClass: $mailableClass,
            subject: $subject,
            to: $to,
            cc: $cc,
        ));
    }

    /**
     * @param  array<int, Address>|null  $addresses
     */
    private static function formatAddresses(?array $addresses): string
    {
        if ($addresses === null || $addresses === []) {
            return '—';
        }

        return collect($addresses)
            ->map(fn (Address $address): string => $address->getAddress())
            ->implode(', ');
    }
}
