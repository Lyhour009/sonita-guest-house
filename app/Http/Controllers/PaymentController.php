<?php

namespace App\Http\Controllers;

use App\Actions\Payments\SubmitPayment;
use App\Http\Requests\PaymentStoreRequest;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * Display the authenticated guest's payments.
     */
    public function index(Request $request): Response
    {
        $payments = $request->user()
            ->payments()
            ->with('invoice.reservation.room')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('payments/index', [
            'payments' => $payments->through(fn (Payment $payment) => [
                'id' => $payment->id,
                'amount' => $payment->amount,
                'method' => $payment->method,
                'status' => $payment->status,
                'has_proof' => $payment->proof_image !== null,
                'paid_at' => $payment->paid_at?->toDateString(),
                'created_at' => $payment->created_at?->toDateString(),
                'room' => [
                    'room_number' => $payment->invoice->reservation->room->room_number,
                ],
            ]),
        ]);
    }

    /**
     * Submit a payment against one of the guest's own invoices.
     */
    public function store(PaymentStoreRequest $request, SubmitPayment $action): RedirectResponse
    {
        $invoice = Invoice::with('reservation')->findOrFail((string) $request->validated('invoice_id'));

        abort_unless($invoice->reservation->guest_id === $request->user()->id, 403);

        $action->handle($request->user(), $invoice, [
            'amount' => $request->validated('amount'),
            'method' => $request->validated('method'),
            'proof_image' => $request->file('proof_image'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Payment submitted — awaiting confirmation.')]);

        return to_route('invoices.index');
    }
}
