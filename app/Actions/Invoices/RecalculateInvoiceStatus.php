<?php

namespace App\Actions\Invoices;

use App\Models\Invoice;

class RecalculateInvoiceStatus
{
    public function handle(Invoice $invoice): Invoice
    {
        $confirmedTotal = $invoice->payments()
            ->where('status', 'confirmed')
            ->sum('amount');

        $status = match (true) {
            $confirmedTotal <= 0 => 'unpaid',
            $confirmedTotal < $invoice->total_amount => 'partial',
            default => 'paid',
        };

        $invoice->update(['status' => $status]);

        return $invoice;
    }
}
