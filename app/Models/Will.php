<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Will extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'will_type',
        'status',
        'personal_info',
        'spouse',
        'executors',
        'alternate_executors',
        'children',
        'guardians',
        'beneficiaries',
        'specific_gifts',
        'total_failure_beneficiaries',
        'pets',
        'additional_clauses',
        'signing_timeline',
        'signing_date',
        'signing_city',
        'signing_country',
        'pdf_path',
        'pdf_generated_at',
        'is_draft',
        'amount',
        'paid_at',
        'payment_reference',
        'form_data',
    ];

    protected $casts = [
        'personal_info' => 'array',
        'spouse' => 'array',
        'executors' => 'array',
        'alternate_executors' => 'array',
        'children' => 'array',
        'guardians' => 'array',
        'beneficiaries' => 'array',
        'specific_gifts' => 'array',
        'total_failure_beneficiaries' => 'array',
        'pets' => 'array',
        'additional_clauses' => 'array',
        'is_draft' => 'boolean',
        'pdf_generated_at' => 'datetime',
        'paid_at' => 'datetime',
        'signing_date' => 'date',
        'amount' => 'decimal:2',
        'form_data' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function markAsPaid(string $paymentReference): void
    {
        $this->update([
            'is_draft' => false,
            'status' => 'completed',
            'paid_at' => now(),
            'payment_reference' => $paymentReference,
        ]);
    }

    public function isSingleWill(): bool
    {
        return $this->will_type === 'Me';
    }

    public function isMirrorWill(): bool
    {
        return $this->will_type === 'Mirror';
    }

    public function isPaid(): bool
    {
        return !is_null($this->paid_at);
    }

    public function isDraft(): bool
    {
        return $this->is_draft;
    }

    public function hasPdf(): bool
    {
        return !is_null($this->pdf_path);
    }
}
