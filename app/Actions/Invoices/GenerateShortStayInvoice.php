<?php

namespace App\Actions\Invoices;

use App\Actions\Notifications\NotifyUser;
use App\Models\Invoice;
use App\Models\Reservation;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;

class GenerateShortStayInvoice
{
    public function __construct(
        private readonly NotifyUser $notifyUser,
        private readonly ApplyPromoDiscount $applyPromoDiscount,
    ) {}

    public function handle(Reservation $reservation): Invoice
    {
        $settings = Setting::first();
        $taxRate = $settings ? (float) $settings->tax_rate : 0.0;

        $nights = max(1, $reservation->check_in_date->diffInDays($reservation->check_out_date));
        $roomCharge = $nights * (float) $reservation->room->price_per_night;
        $serviceCharge = (float) $reservation->services()->sum('services.price');
        $subtotal = $roomCharge + $serviceCharge;

        return DB::transaction(function () use ($reservation, $roomCharge, $serviceCharge, $subtotal, $taxRate) {
            $discountAmount = $this->applyPromoDiscount->handle($reservation->promo_code, $subtotal);
            $taxAmount = round(($subtotal - $discountAmount) * $taxRate / 100, 2);

            $invoice = $reservation->invoices()->create([
                'invoice_type' => 'short_stay',
                'room_charge' => $roomCharge,
                'service_charge' => $serviceCharge,
                'tax_amount' => $taxAmount,
                'discount_amount' => $discountAmount,
                'total_amount' => $subtotal - $discountAmount + $taxAmount,
                'status' => 'unpaid',
                'due_date' => now()->toDateString(),
            ]);

            $this->notifyUser->handle(
                $reservation->guest,
                'invoice_issued',
                "A new invoice of \${$invoice->total_amount} has been issued for Room {$reservation->room->room_number}.",
                ['amount' => $invoice->total_amount, 'room' => $reservation->room->room_number],
                route('invoices.index'),
            );

            return $invoice;
        });
    }
}
