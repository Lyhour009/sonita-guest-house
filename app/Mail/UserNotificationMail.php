<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class UserNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    private const SUBJECTS = [
        'reservation_confirmed' => 'Your reservation has been confirmed',
        'invoice_issued' => 'A new invoice has been issued',
        'payment_confirmed' => 'Your payment has been confirmed',
        'maintenance_status_changed' => 'Update on your maintenance request',
        'maintenance_assigned' => 'You have a new maintenance assignment',
    ];

    public function __construct(
        public readonly string $type,
        public readonly string $notificationMessage,
        public readonly ?string $link = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: self::SUBJECTS[$this->type] ?? Str::of($this->type)->replace('_', ' ')->ucfirst()->toString(),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.user-notification',
        );
    }
}
