<?php

namespace App\Notifications;

use App\Models\Lpa;
use App\Support\OperationsSlack;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Slack\BlockKit\Blocks\ContextBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\SectionBlock;
use Illuminate\Notifications\Slack\SlackMessage;

class LpaMarkedPaidSlackNotification extends Notification
{
    public function __construct(public Lpa $lpa) {}

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
        [$customerLine, $paymentStatus, $price, $paidAt, $ref] = $this->summaryFields();
        $lpa = $this->lpa;

        return (new SlackMessage)
            ->text("LPA #{$lpa->getKey()} submitted — {$customerLine}")
            ->headerBlock('LPA Submitted')
            ->contextBlock(function (ContextBlock $block): void {
                $block->text('Customer completion email and admin summary email have been queued.');
            })
            ->sectionBlock(function (SectionBlock $block) use ($lpa, $paymentStatus, $price, $customerLine, $paidAt, $ref): void {
                $block->field("*Payment status*\n{$paymentStatus}")->markdown();
                $block->field("*Price*\n{$price}")->markdown();
                $block->field("*LPA ID*\n#{$lpa->getKey()}")->markdown();
                $block->field("*Customer*\n{$customerLine}")->markdown();
                $block->field("*Paid at*\n{$paidAt}")->markdown();
                $block->field("*Payment reference*\n`{$ref}`")->markdown();
            });
    }

    public function toMail(object $notifiable): MailMessage
    {
        [$customerLine, $paymentStatus, $price, $paidAt, $ref] = $this->summaryFields();
        $lpa = $this->lpa;

        return (new MailMessage)
            ->subject("[Slack mirror] LPA Submitted #{$lpa->getKey()} — {$customerLine}")
            ->line('LPA Submitted (mirrored from Slack).')
            ->line("Customer: {$customerLine}")
            ->line("LPA ID: #{$lpa->getKey()}")
            ->line("Payment status: {$paymentStatus}")
            ->line("Price: {$price}")
            ->line("Paid at: {$paidAt}")
            ->line("Payment reference: {$ref}");
    }

    /**
     * @return array{0:string,1:string,2:string,3:string,4:string}
     */
    private function summaryFields(): array
    {
        $lpa = $this->lpa->loadMissing('user');
        $user = $lpa->user;
        $customerLine = $user
            ? "{$user->name} ({$user->email})"
            : 'Unknown customer';

        $rawStatus = (string) ($lpa->status ?? 'completed');
        $paymentStatus = $rawStatus === 'completed' ? 'Paid (completed)' : ucfirst($rawStatus);

        $paidAt = $lpa->paid_at?->format('d M Y H:i') ?? '—';
        $price = $lpa->amount !== null
            ? '£'.number_format((float) $lpa->amount, 2)
            : '—';
        $ref = $lpa->payment_reference ?? '—';

        return [$customerLine, $paymentStatus, $price, $paidAt, $ref];
    }
}
