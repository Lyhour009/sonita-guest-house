<?php

namespace App\Actions\Payments;

use App\Models\Payment;

class RejectPayment
{
    public function handle(Payment $payment): Payment
    {
        $payment->update(['status' => 'failed']);

        return $payment;
    }
}
