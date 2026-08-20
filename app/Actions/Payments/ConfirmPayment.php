<?php

namespace App\Actions\Payments;

use App\Actions\Invoices\RecalculateInvoiceStatus;
use App\Actions\Notifications\NotifyUser;
use App\Models\Payment;

class ConfirmPayment
{
    public function __construct(
        private readonly RecalculateInvoiceStatus $recalculateInvoiceStatus,
        private readonly NotifyUser $notifyUser,
    ) {}

    public function handle(Payment $payment): Payment
    {
        $payment->update([
            'status' => 'confirmed',
            'paid_at' => now(),
        ]);

        $this->recalculateInvoiceStatus->handle($payment->invoice);

        $this->notifyUser->handle(
            $payment->guest,
            'payment_confirmed',
            "Your payment of \${$payment->amount} has been confirmed.",
            route('invoices.index'),
        );

        return $payment;
    }
}
