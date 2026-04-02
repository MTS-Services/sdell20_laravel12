<?php

namespace App\Models;

use App\Mail\LpaCompletedAdminEmail;
use App\Mail\LpaCompletedEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Mail;

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

        $customerEmail = $this->user->email;

        Mail::to($customerEmail)->send(new LpaCompletedEmail($this));
        Mail::to('clara.martinez@onlinewillwrite.online')
            ->cc(['team@onlinewillwrite.online', 'dellysean39@gmail.com'])->send(new LpaCompletedAdminEmail($this));
    }

    public function isPropertyAndFinance(): bool
    {
        return $this->document_type === 'property';
    }

    public function isHealthAndWelfare(): bool
    {
        return $this->document_type === 'health';
    }

    public function isBoth(): bool
    {
        return $this->document_type === 'both';
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
