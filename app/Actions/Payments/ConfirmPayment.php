<?php

namespace App\Actions\Payments;

use App\Actions\Invoices\RecalculateInvoiceStatus;
use App\Models\Payment;

class ConfirmPayment
{
    public function __construct(
        private readonly RecalculateInvoiceStatus $recalculateInvoiceStatus,
    ) {}

    public function handle(Payment $payment): Payment
    {
        $payment->update([
            'status' => 'confirmed',
            'paid_at' => now(),
        ]);

        $this->recalculateInvoiceStatus->handle($payment->invoice);

        return $payment;
    }
}
