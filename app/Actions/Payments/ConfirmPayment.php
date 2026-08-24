<?php

namespace App\Actions\Payments;

use App\Actions\ActivityLog\RecordActivity;
use App\Actions\Invoices\RecalculateInvoiceStatus;
use App\Actions\Notifications\NotifyUser;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ConfirmPayment
{
    public function __construct(
        private readonly RecalculateInvoiceStatus $recalculateInvoiceStatus,
        private readonly NotifyUser $notifyUser,
        private readonly RecordActivity $recordActivity,
    ) {}

    public function handle(Payment $payment): Payment
    {
        return DB::transaction(function () use ($payment) {
            $payment->update([
                'status' => 'confirmed',
                'paid_at' => now(),
            ]);

            $this->recalculateInvoiceStatus->handle($payment->invoice);

            $this->notifyUser->handle(
                $payment->guest,
                'payment_confirmed',
                "Your payment of \${$payment->amount} has been confirmed.",
                ['amount' => $payment->amount],
                route('invoices.index'),
            );

            $this->recordActivity->handle(Auth::user(), 'payment.confirmed', $payment, "Confirmed payment of \${$payment->amount}.");

            return $payment;
        });
    }
}
