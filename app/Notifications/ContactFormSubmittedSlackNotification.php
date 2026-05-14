<?php

namespace App\Notifications;

use App\Support\OperationsSlack;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Slack\BlockKit\Blocks\ContextBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\SectionBlock;
use Illuminate\Notifications\Slack\SlackMessage;

class ContactFormSubmittedSlackNotification extends Notification
{
    public function __construct(
        public string $firstName,
        public string $lastName,
        public string $email,
        public string $phone,
        public ?string $message = null,
    ) {}

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        $channels = [];

        if (OperationsSlack::isConfigured()) {
            $channels[] = 'slack';
        }

        if (OperationsSlack::mirrorEmail() !== null) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toSlack(object $notifiable): SlackMessage
    {
        $fullName = trim("{$this->firstName} {$this->lastName}");
        $message = filled($this->message) ? $this->message : '—';

        return (new SlackMessage)
            ->text("Contact form submitted by {$fullName} ({$this->email})")
            ->headerBlock('Contact Page Form')
            ->contextBlock(function (ContextBlock $block): void {
                $block->text('A visitor submitted the public contact form. The email to Clara has been queued.');
            })
            ->sectionBlock(function (SectionBlock $block) use ($fullName, $message): void {
                $block->field("*Name*\n{$fullName}")->markdown();
                $block->field("*Email*\n{$this->email}")->markdown();
                $block->field("*Phone*\n{$this->phone}")->markdown();
                $block->field("*Message*\n{$message}")->markdown();
            });
    }

    public function toMail(object $notifiable): MailMessage
    {
        $fullName = trim("{$this->firstName} {$this->lastName}");
        $message = filled($this->message) ? $this->message : '—';

        return (new MailMessage)
            ->subject("[Slack mirror] Contact Page Form — {$fullName}")
            ->line('Contact Page Form submission (mirrored from Slack).')
            ->line("Name: {$fullName}")
            ->line("Email: {$this->email}")
            ->line("Phone: {$this->phone}")
            ->line("Message: {$message}");
    }
}
