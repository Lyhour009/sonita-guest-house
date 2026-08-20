<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $roomCharge = fake()->randomFloat(2, 50, 300);
        $serviceCharge = 0;
        $taxAmount = round(($roomCharge + $serviceCharge) * 0.1, 2);

        return [
            'reservation_id' => Reservation::factory(),
            'invoice_type' => 'short_stay',
            'billing_period' => null,
            'room_charge' => $roomCharge,
            'service_charge' => $serviceCharge,
            'utility_charge' => null,
            'elec_meter_start' => null,
            'elec_meter_end' => null,
            'water_meter_start' => null,
            'water_meter_end' => null,
            'tax_amount' => $taxAmount,
            'total_amount' => $roomCharge + $serviceCharge + $taxAmount,
            'status' => 'unpaid',
            'due_date' => now()->toDateString(),
        ];
    }
}
