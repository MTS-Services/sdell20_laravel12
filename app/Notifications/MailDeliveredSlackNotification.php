<?php

namespace App\Notifications;

use App\Support\OperationsSlack;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Slack\BlockKit\Blocks\ContextBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\SectionBlock;
use Illuminate\Notifications\Slack\SlackMessage;

class MailDeliveredSlackNotification extends Notification
{
    public function __construct(
        public string $mailableClass,
        public string $subject,
        public string $to,
        public string $cc,
    ) {}

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return OperationsSlack::isConfigured() ? ['slack'] : [];
    }

    public function toSlack(object $notifiable): SlackMessage
    {
        $shortClass = class_basename($this->mailableClass);

        return (new SlackMessage)
            ->text("Email delivered: {$shortClass} → {$this->to} — {$this->subject}")
            ->headerBlock('Email delivered (transport)')
            ->contextBlock(function (ContextBlock $block): void {
                $block->text('The mail transport accepted this message. Inbox delivery still depends on the recipient server and spam filters.');
            })
            ->sectionBlock(function (SectionBlock $block) use ($shortClass): void {
                $block->field("*Mailable*\n{$shortClass}")->markdown();
                $block->field("*To*\n{$this->to}")->markdown();
            })
            ->sectionBlock(function (SectionBlock $block): void {
                $block->field("*CC*\n{$this->cc}")->markdown();
                $block->field("*Subject*\n{$this->subject}")->markdown();
            });
    }
}
