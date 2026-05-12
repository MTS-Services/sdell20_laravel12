<?php

namespace App\Mail;

use App\Models\Will;
use App\Support\WillAdminEmailSummary;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WillCompletedAdminEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Will $will) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Will Completed - '.config('app.name'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin.will_completed',
            with: [
                'summarySections' => WillAdminEmailSummary::sections($this->will),
            ],
        );
    }

    /**
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
