<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Invoices\GenerateLongStayInvoice;
use App\Actions\Invoices\RenderInvoicePdf;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LongStayInvoiceStoreRequest;
use App\Models\Invoice;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class InvoiceController extends Controller
{
    /**
     * Display every invoice for admin oversight.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'status' => ['nullable', 'string', 'in:unpaid,partial,paid'],
        ]);

        $invoices = Invoice::query()
            ->with('reservation.room', 'reservation.guest')
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/invoices/index', [
            'invoices' => $invoices->through(fn (Invoice $invoice) => [
                'id' => $invoice->id,
                'invoice_type' => $invoice->invoice_type,
                'billing_period' => $invoice->billing_period?->toDateString(),
                'total_amount' => $invoice->total_amount,
                'status' => $invoice->status,
                'due_date' => $invoice->due_date?->toDateString(),
                'guest' => [
                    'full_name' => $invoice->reservation->guest->full_name,
                ],
                'room' => [
                    'room_number' => $invoice->reservation->room->room_number,
                ],
            ]),
            'filters' => [
                'status' => $filters['status'] ?? null,
            ],
            'activeLongStayReservations' => Reservation::query()
                ->where('reservation_type', 'long_stay')
                ->where('status', 'active')
                ->with('room', 'guest')
                ->get()
                ->map(fn (Reservation $reservation) => [
                    'id' => $reservation->id,
                    'guest_name' => $reservation->guest->full_name,
                    'room_number' => $reservation->room->room_number,
                ]),
        ]);
    }

    /**
     * Manually generate a long-stay monthly invoice.
     */
    public function store(LongStayInvoiceStoreRequest $request, GenerateLongStayInvoice $action): RedirectResponse
    {
        $reservation = Reservation::findOrFail((string) $request->validated('reservation_id'));

        $action->handle($reservation, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Invoice generated.')]);

        return to_route('admin.invoices.index');
    }

    /**
     * Download any invoice as a PDF.
     */
    public function download(Invoice $invoice, RenderInvoicePdf $renderInvoicePdf): SymfonyResponse
    {
        return $renderInvoicePdf->handle($invoice)->download("invoice-{$invoice->id}.pdf");
    }
}
