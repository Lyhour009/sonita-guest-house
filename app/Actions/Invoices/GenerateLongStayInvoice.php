<?php

namespace App\Actions\Invoices;

use App\Actions\Notifications\NotifyUser;
use App\Models\Invoice;
use App\Models\Reservation;
use App\Models\Setting;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class GenerateLongStayInvoice
{
    public function __construct(
        private readonly NotifyUser $notifyUser,
        private readonly ApplyPromoDiscount $applyPromoDiscount,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(Reservation $reservation, array $data): Invoice
    {
        $settings = Setting::first();
        $taxRate = $settings ? (float) $settings->tax_rate : 0.0;
        $electricRate = $settings ? (float) $settings->electric_rate : 0.0;
        $waterRate = $settings ? (float) $settings->water_rate : 0.0;

        $billingPeriod = isset($data['billing_period'])
            ? Carbon::parse($data['billing_period'])->startOfMonth()
            : now()->startOfMonth();

        $roomCharge = (float) $reservation->room->price_per_month;
        $serviceCharge = (float) $reservation->services()->sum('services.price');
        $utilityCharge = (($data['elec_meter_end'] - $data['elec_meter_start']) * $electricRate)
            + (($data['water_meter_end'] - $data['water_meter_start']) * $waterRate);
        $subtotal = $roomCharge + $serviceCharge + $utilityCharge;

        $dueDate = $reservation->monthly_due_day
            ? $billingPeriod->copy()->day(min($reservation->monthly_due_day, $billingPeriod->daysInMonth))
            : $billingPeriod->copy()->addDays(7);

        return DB::transaction(function () use ($reservation, $data, $billingPeriod, $roomCharge, $serviceCharge, $utilityCharge, $subtotal, $taxRate, $dueDate) {
            $discountAmount = $this->applyPromoDiscount->handle($reservation->promo_code, $subtotal);
            $taxAmount = round(($subtotal - $discountAmount) * $taxRate / 100, 2);

            $invoice = $reservation->invoices()->create([
                'invoice_type' => 'long_stay',
                'billing_period' => $billingPeriod->toDateString(),
                'room_charge' => $roomCharge,
                'service_charge' => $serviceCharge,
                'utility_charge' => $utilityCharge,
                'elec_meter_start' => $data['elec_meter_start'],
                'elec_meter_end' => $data['elec_meter_end'],
                'water_meter_start' => $data['water_meter_start'],
                'water_meter_end' => $data['water_meter_end'],
                'tax_amount' => $taxAmount,
                'discount_amount' => $discountAmount,
                'total_amount' => $subtotal - $discountAmount + $taxAmount,
                'status' => 'unpaid',
                'due_date' => $dueDate->toDateString(),
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
