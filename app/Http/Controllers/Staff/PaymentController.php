<?php

namespace App\Http\Controllers\Staff;

use App\Actions\Payments\ConfirmPayment;
use App\Actions\Payments\RejectPayment;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * Display every payment for front-desk review.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:pending,confirmed,failed,refunded'],
        ]);

        $payments = Payment::query()
            ->with(['guest', 'invoice.reservation.room'])
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query->whereHas(
                'guest',
                fn ($guest) => $guest->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%"),
            ))
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('staff/payments/index', [
            'payments' => $payments->through(fn (Payment $payment) => [
                'id' => $payment->id,
                'amount' => $payment->amount,
                'method' => $payment->method,
                'status' => $payment->status,
                'has_proof' => $payment->proof_image !== null,
                'created_at' => $payment->created_at?->toDateString(),
                'guest' => [
                    'full_name' => $payment->guest->full_name,
                    'email' => $payment->guest->email,
                ],
                'room' => [
                    'room_number' => $payment->invoice->reservation->room->room_number,
                ],
            ]),
            'filters' => [
                'search' => $filters['search'] ?? null,
                'status' => $filters['status'] ?? null,
            ],
        ]);
    }

    /**
     * Confirm a payment.
     */
    public function confirm(Payment $payment, ConfirmPayment $action): RedirectResponse
    {
        $action->handle($payment);

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.payments.confirmed']);

        return back();
    }

    /**
     * Reject a payment.
     */
    public function reject(Payment $payment, RejectPayment $action): RedirectResponse
    {
        $action->handle($payment);

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.payments.rejected']);

        return back();
    }
}
