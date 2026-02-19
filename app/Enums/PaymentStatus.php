<?php

namespace App\Enums;

/**
 * Payment status stored in DB: pending, processing, succeeded, canceled.
 * Stripe's requires_payment_method, requires_confirmation, requires_action are mapped to pending.
 */
enum PaymentStatus: string
{
    case Pending = 'pending';

    case Processing = 'processing';

    case Complete = 'succeeded';

    case Canceled = 'canceled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Processing => 'Processing',
            self::Complete => 'Complete',
            self::Canceled => 'Canceled',
        };
    }

    public function isComplete(): bool
    {
        return $this === self::Complete;
    }

    public function isCanceled(): bool
    {
        return $this === self::Canceled;
    }

    public function isProcessing(): bool
    {
        return $this === self::Processing;
    }

    public function isPending(): bool
    {
        return $this === self::Pending;
    }

    /**
     * Map Stripe PaymentIntent status to stored status.
     * requires_payment_method, requires_confirmation, requires_action → pending.
     */
    public static function storeFromStripe(string $stripeStatus): self
    {
        return match ($stripeStatus) {
            'requires_payment_method', 'requires_confirmation', 'requires_action' => self::Pending,
            'processing' => self::Processing,
            'succeeded' => self::Complete,
            'canceled' => self::Canceled,
            default => self::Pending,
        };
    }
}
