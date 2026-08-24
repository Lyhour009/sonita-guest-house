<?php

namespace Database\Factories;

use App\Models\WaitlistEntry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WaitlistEntry>
 */
class WaitlistEntryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => fake()->safeEmail(),
            'phone_number' => fake()->phoneNumber(),
            'stay_type' => 'short_stay',
            'from_date' => now()->addDays(7)->toDateString(),
            'to_date' => now()->addDays(9)->toDateString(),
            'notified_at' => null,
        ];
    }

    /**
     * Indicate that the entry has already been notified.
     */
    public function notified(): static
    {
        return $this->state(fn (array $attributes) => ['notified_at' => now()]);
    }
}
