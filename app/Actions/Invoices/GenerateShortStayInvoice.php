<?php

namespace App\Actions\Invoices;

use App\Actions\Notifications\NotifyUser;
use App\Models\Invoice;
use App\Models\Reservation;
use App\Models\Setting;

class GenerateShortStayInvoice
{
    public function __construct(
        private readonly NotifyUser $notifyUser,
    ) {}

    public function handle(Reservation $reservation): Invoice
    {
        $settings = Setting::first();
        $taxRate = $settings ? (float) $settings->tax_rate : 0.0;

        $nights = max(1, $reservation->check_in_date->diffInDays($reservation->check_out_date));
        $roomCharge = $nights * (float) $reservation->room->price_per_night;
        $serviceCharge = (float) $reservation->services()->sum('services.price');
        $taxAmount = round(($roomCharge + $serviceCharge) * $taxRate / 100, 2);

        $invoice = $reservation->invoices()->create([
            'invoice_type' => 'short_stay',
            'room_charge' => $roomCharge,
            'service_charge' => $serviceCharge,
            'tax_amount' => $taxAmount,
            'total_amount' => $roomCharge + $serviceCharge + $taxAmount,
            'status' => 'unpaid',
            'due_date' => now()->toDateString(),
        ]);

        $this->notifyUser->handle(
            $reservation->guest,
            'invoice_issued',
            "A new invoice of \${$invoice->total_amount} has been issued for Room {$reservation->room->room_number}.",
            route('invoices.index'),
        );

        return $invoice;
    }
}
