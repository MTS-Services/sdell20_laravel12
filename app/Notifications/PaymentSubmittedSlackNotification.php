<?php

namespace App\Notifications;

use App\Models\Payment;
use App\Support\OperationsSlack;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Slack\BlockKit\Blocks\ContextBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\SectionBlock;
use Illuminate\Notifications\Slack\SlackMessage;

class PaymentSubmittedSlackNotification extends Notification
{
    public function __construct(public Payment $payment) {}

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
        [$customerLine, $priceLabel, $productLabel, $intentId] = $this->summaryFields();
        $payment = $this->payment;

        return (new SlackMessage)
            ->text("Pay Page submitted by {$customerLine} — {$priceLabel}")
            ->headerBlock('Pay Page Submitted')
            ->contextBlock(function (ContextBlock $block): void {
                $block->text('A Stripe payment was confirmed on the checkout page.');
            })
            ->sectionBlock(function (SectionBlock $block) use ($payment, $customerLine, $priceLabel, $productLabel, $intentId): void {
                $block->field("*Customer*\n{$customerLine}")->markdown();
                $block->field("*Product*\n{$productLabel}")->markdown();
                $block->field("*Amount*\n{$priceLabel}")->markdown();
                $block->field("*Payment ID*\n#{$payment->getKey()}")->markdown();
                $block->field("*Stripe intent*\n`{$intentId}`")->markdown();
                $block->field("*Status*\n".(string) ($payment->status?->value ?? '—'))->markdown();
            });
    }

    public function toMail(object $notifiable): MailMessage
    {
        [$customerLine, $priceLabel, $productLabel, $intentId] = $this->summaryFields();
        $payment = $this->payment;

        return (new MailMessage)
            ->subject("[Slack mirror] Pay Page Submitted — {$customerLine} ({$priceLabel})")
            ->line('Pay Page Submitted (mirrored from Slack).')
            ->line("Customer: {$customerLine}")
            ->line("Product: {$productLabel}")
            ->line("Amount: {$priceLabel}")
            ->line("Payment ID: #{$payment->getKey()}")
            ->line("Stripe intent: {$intentId}")
            ->line('Status: '.(string) ($payment->status?->value ?? '—'));
    }

    /**
     * @return array{0:string,1:string,2:string,3:string}
     */
    private function summaryFields(): array
    {
        $payment = $this->payment->loadMissing('user');
        $user = $payment->user;
        $customerLine = $user
            ? "{$user->name} ({$user->email})"
            : 'Guest customer';

        $currency = strtoupper((string) ($payment->currency ?? 'GBP'));
        $amountPence = (int) ($payment->amount ?? 0);
        $priceLabel = ($currency === 'GBP' ? '£' : $currency.' ').number_format($amountPence / 100, 2);

        $product = $payment->getProduct();
        $productLabel = $product?->value ?? '—';

        $intentId = $payment->stripe_payment_intent_id ?? '—';

        return [$customerLine, $priceLabel, $productLabel, $intentId];
    }
}
