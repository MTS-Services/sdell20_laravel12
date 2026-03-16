<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lpa extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'who_for',
        'document_type',
        'status',
        'donor_details',
        'contact_details',
        'attorneys',
        'can_view_documents',
        'replacement_attorneys',
        'want_replacement_attorneys',
        'life_sustaining_treatment',
        'notify_people',
        'applicant',
        'document_recipient',
        'certificate_choice',
        'pdf_path',
        'pdf_generated_at',
        'is_draft',
        'amount',
        'paid_at',
        'payment_reference',
    ];

    protected $casts = [
        'donor_details' => 'array',
        'contact_details' => 'array',
        'attorneys' => 'array',
        'replacement_attorneys' => 'array',
        'can_view_documents' => 'boolean',
        'want_replacement_attorneys' => 'boolean',
        'life_sustaining_treatment' => 'boolean',
        'notify_people' => 'boolean',
        'certificate_choice' => 'boolean',
        'is_draft' => 'boolean',
        'pdf_generated_at' => 'datetime',
        'paid_at' => 'datetime',
        'amount' => 'decimal:2',
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

        \Illuminate\Support\Facades\Mail::to($this->user->email)->send(new \App\Mail\LpaCompletedEmail($this));
    }

    public function isPropertyAndFinance(): bool
    {
        return $this->document_type === 'property';
    }

    public function isHealthAndWelfare(): bool
    {
        return $this->document_type === 'health';
    }

    public function isPaid(): bool
    {
        return ! is_null($this->paid_at);
    }

    public function isDraft(): bool
    {
        return $this->is_draft;
    }

    public function hasPdf(): bool
    {
        return ! is_null($this->pdf_path);
    }
}
