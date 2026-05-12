<?php

namespace App\Notifications;

use App\Models\Lpa;
use App\Support\OperationsSlack;
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
        return OperationsSlack::isConfigured() ? ['slack'] : [];
    }

    public function toSlack(object $notifiable): SlackMessage
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

        return (new SlackMessage)
            ->text("LPA #{$lpa->getKey()} paid and completed — {$customerLine}")
            ->headerBlock('LPA payment completed')
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
}
