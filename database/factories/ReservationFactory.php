<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checkIn = fake()->dateTimeBetween('now', '+1 month');
        $checkOut = fake()->dateTimeBetween($checkIn, $checkIn->modify('+5 days'));

        return [
            'guest_id' => User::factory(),
            'room_id' => Room::factory(),
            'reservation_type' => 'short_stay',
            'check_in_date' => $checkIn,
            'check_out_date' => $checkOut,
            'num_guests' => fake()->numberBetween(1, 2),
            'status' => 'confirmed',
        ];
    }

    /**
     * Indicate a long-stay reservation.
     */
    public function longStay(): static
    {
        $start = fake()->dateTimeBetween('now', '+1 month');

        return $this->state(fn (array $attributes) => [
            'reservation_type' => 'long_stay',
            'check_in_date' => null,
            'check_out_date' => null,
            'start_date' => $start,
            'end_date' => null,
            'monthly_due_day' => fake()->numberBetween(1, 28),
            'num_guests' => null,
        ]);
    }
}
