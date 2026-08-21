<?php

namespace App\Actions\Invoices;

use App\Models\Invoice;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as PdfDocument;

class RenderInvoicePdf
{
    public function handle(Invoice $invoice): PdfDocument
    {
        $invoice->loadMissing('reservation.room', 'reservation.guest', 'payments');

        return Pdf::loadView('invoices.pdf', [
            'invoice' => $invoice,
            'reservation' => $invoice->reservation,
            'room' => $invoice->reservation->room,
            'guest' => $invoice->reservation->guest,
            'settings' => Setting::first(),
            'confirmedPaid' => $invoice->confirmedPaidTotal(),
            'outstandingBalance' => $invoice->outstandingBalance(),
        ])->setPaper('a4');
    }
}
