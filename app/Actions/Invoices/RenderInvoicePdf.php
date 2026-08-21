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

        $confirmedPaid = (float) $invoice->payments->where('status', 'confirmed')->sum('amount');

        return Pdf::loadView('invoices.pdf', [
            'invoice' => $invoice,
            'reservation' => $invoice->reservation,
            'room' => $invoice->reservation->room,
            'guest' => $invoice->reservation->guest,
            'settings' => Setting::first(),
            'confirmedPaid' => $confirmedPaid,
            'outstandingBalance' => round((float) $invoice->total_amount - $confirmedPaid, 2),
        ])->setPaper('a4');
    }
}
