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
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:unpaid,partial,paid,overdue'],
        ]);

        $overdueQuery = fn ($query) => $query->where('status', '!=', 'paid')
            ->whereNotNull('due_date')
            ->where('due_date', '<', now()->toDateString());

        $invoices = Invoice::query()
            ->with('reservation.room', 'reservation.guest', 'payments')
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query->whereHas(
                'reservation',
                fn ($query) => $query->whereHas('guest', fn ($query) => $query->where('full_name', 'like', "%{$search}%"))
                    ->orWhereHas('room', fn ($query) => $query->where('room_number', 'like', "%{$search}%")),
            ))
            ->when($filters['status'] ?? null, fn ($query, string $status) => $status === 'overdue'
                ? $overdueQuery($query)
                : $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $statusCounts = [
            'all' => Invoice::count(),
            'unpaid' => Invoice::where('status', 'unpaid')->count(),
            'partial' => Invoice::where('status', 'partial')->count(),
            'overdue' => $overdueQuery(Invoice::query())->count(),
        ];

        return Inertia::render('admin/invoices/index', [
            'invoices' => $invoices->through(fn (Invoice $invoice) => [
                'id' => $invoice->id,
                'invoice_type' => $invoice->invoice_type,
                'billing_period' => $invoice->billing_period?->toDateString(),
                'total_amount' => $invoice->total_amount,
                'outstanding_balance' => $invoice->outstandingBalance(),
                'status' => $invoice->status,
                'due_date' => $invoice->due_date?->toDateString(),
                'is_overdue' => $invoice->due_date !== null
                    && $invoice->due_date->isPast()
                    && $invoice->status !== 'paid',
                'guest' => [
                    'full_name' => $invoice->reservation->guest->full_name,
                ],
                'room' => [
                    'room_number' => $invoice->reservation->room->room_number,
                ],
            ]),
            'filters' => [
                'search' => $filters['search'] ?? null,
                'status' => $filters['status'] ?? null,
            ],
            'statusCounts' => $statusCounts,
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

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.invoices.generated']);

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
