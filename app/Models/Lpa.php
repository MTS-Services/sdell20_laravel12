<?php

namespace App\Models;

use App\Mail\LpaCompletedAdminEmail;
use App\Mail\LpaCompletedEmail;
use App\Notifications\LpaMarkedPaidSlackNotification;
use App\Support\OperationsSlack;
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
        'lp1h_form',
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
        'lp1h_form' => 'array',
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

        $lpa = $this->fresh();
        $customerEmail = $lpa->user->email;

        /*
         * Stagger sends: sandbox providers (e.g. Mailtrap free tier) often enforce "emails per second".
         * Payment flow also queues PaymentCompletedEmail in the same request, so three mailables
         * must not hit SMTP in the same second.
         */
        Mail::to($customerEmail)->queue(
            (new LpaCompletedEmail($lpa))->delay(now()->addSeconds(4))
        );

        $adminAddress = config('mail.lpa_completed_admin_address');
        $adminCc = config('mail.lpa_completed_admin_cc', []);

        if (is_string($adminAddress) && $adminAddress !== '') {
            $pending = Mail::to($adminAddress);
            if (is_array($adminCc) && $adminCc !== []) {
                $pending->cc($adminCc);
            }
            $pending->queue((new LpaCompletedAdminEmail($lpa))->delay(now()->addSeconds(12)));
        }

        OperationsSlack::notify(new LpaMarkedPaidSlackNotification($lpa));
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
