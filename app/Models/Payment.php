<?php

namespace App\Models;

use App\Enums\PaymentProduct;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'stripe_payment_intent_id',
        'amount',
        'currency',
        'status',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'status' => PaymentStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isCompleted(): bool
    {
        return $this->status?->isComplete() ?? false;
    }

    public function isPending(): bool
    {
        return $this->status?->isPending() ?? $this->status?->isProcessing() ?? false;
    }

    public function isRejected(): bool
    {
        return $this->status?->isCanceled() ?? false;
    }

    public function isProcessing(): bool
    {
        return $this->status?->isProcessing() ?? false;
    }

    /**
     * Scope to filter payments by product type.
     */
    public function scopeForProduct(Builder $query, PaymentProduct $product): Builder
    {
        return $query->whereJsonContains('metadata->product', $product->value);
    }

    /**
     * Scope to filter only completed/succeeded payments.
     */
    public function scopeSucceeded(Builder $query): Builder
    {
        return $query->where('status', PaymentStatus::Complete);
    }

    /**
     * Get the product type from metadata.
     */
    public function getProduct(): ?PaymentProduct
    {
        $product = $this->metadata['product'] ?? null;

        return $product ? PaymentProduct::tryFrom($product) : null;
    }
}
