<?php

namespace App\Http\Controllers;

use App\Actions\Invoices\RenderInvoicePdf;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class InvoiceController extends Controller
{
    /**
     * Display the authenticated guest's invoices.
     */
    public function index(Request $request): Response
    {
        $invoices = Invoice::query()
            ->whereHas('reservation', fn ($query) => $query->where('guest_id', $request->user()->id))
            ->with('reservation.room')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('invoices/index', [
            'invoices' => $invoices->through(fn (Invoice $invoice) => $this->invoicePayload($invoice)),
        ]);
    }

    /**
     * Download the authenticated guest's own invoice as a PDF.
     */
    public function download(Request $request, Invoice $invoice, RenderInvoicePdf $renderInvoicePdf): SymfonyResponse
    {
        $invoice->loadMissing('reservation');

        abort_unless($invoice->reservation->guest_id === $request->user()->id, 403);

        return $renderInvoicePdf->handle($invoice)->download("invoice-{$invoice->id}.pdf");
    }

    /**
     * @return array<string, mixed>
     */
    private function invoicePayload(Invoice $invoice): array
    {
        return [
            'id' => $invoice->id,
            'invoice_type' => $invoice->invoice_type,
            'billing_period' => $invoice->billing_period?->toDateString(),
            'room_charge' => $invoice->room_charge,
            'service_charge' => $invoice->service_charge,
            'utility_charge' => $invoice->utility_charge,
            'tax_amount' => $invoice->tax_amount,
            'total_amount' => $invoice->total_amount,
            'status' => $invoice->status,
            'due_date' => $invoice->due_date?->toDateString(),
            'outstanding_balance' => $invoice->outstandingBalance(),
            'room' => [
                'room_number' => $invoice->reservation->room->room_number,
                'room_type' => $invoice->reservation->room->room_type,
            ],
        ];
    }
}
