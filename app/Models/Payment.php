<?php

namespace App\Models;

use App\Enums\PaymentStatus;
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
}
