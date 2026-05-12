<?php

namespace App\Notifications;

use App\Models\Will;
use App\Support\OperationsSlack;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Slack\BlockKit\Blocks\ContextBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\SectionBlock;
use Illuminate\Notifications\Slack\SlackMessage;

class WillMarkedPaidSlackNotification extends Notification
{
    public function __construct(public Will $will) {}

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return OperationsSlack::isConfigured() ? ['slack'] : [];
    }

    public function toSlack(object $notifiable): SlackMessage
    {
        $will = $this->will->loadMissing('user');
        $user = $will->user;
        $customerLine = $user
            ? "{$user->name} ({$user->email})"
            : 'Unknown customer';

        $rawStatus = (string) ($will->status ?? 'completed');
        $paymentStatus = $rawStatus === 'completed' ? 'Paid (completed)' : ucfirst($rawStatus);

        $paidAt = $will->paid_at?->format('d M Y H:i') ?? '—';
        $price = $will->amount !== null
            ? '£'.number_format((float) $will->amount, 2)
            : '—';
        $ref = $will->payment_reference ?? '—';
        $willType = $will->isSingleWill() ? 'Single' : 'Mirror';

        return (new SlackMessage)
            ->text("Will #{$will->getKey()} ({$willType}) paid and completed — {$customerLine}")
            ->headerBlock('Will payment completed')
            ->contextBlock(function (ContextBlock $block): void {
                $block->text('Customer completion email and admin summary email have been queued.');
            })
            ->sectionBlock(function (SectionBlock $block) use ($will, $paymentStatus, $price, $customerLine, $paidAt, $ref, $willType): void {
                $block->field("*Payment status*\n{$paymentStatus}")->markdown();
                $block->field("*Price*\n{$price}")->markdown();
                $block->field("*Will ID*\n#{$will->getKey()} ({$willType})")->markdown();
                $block->field("*Customer*\n{$customerLine}")->markdown();
                $block->field("*Paid at*\n{$paidAt}")->markdown();
                $block->field("*Payment reference*\n`{$ref}`")->markdown();
            });
    }
}
