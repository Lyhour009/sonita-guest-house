<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invoice_id' => Invoice::factory(),
            'guest_id' => User::factory(),
            'amount' => fake()->randomFloat(2, 10, 200),
            'method' => fake()->randomElement(['cash', 'bank_transfer', 'qr']),
            'proof_image' => null,
            'status' => 'pending',
            'paid_at' => null,
        ];
    }
}
