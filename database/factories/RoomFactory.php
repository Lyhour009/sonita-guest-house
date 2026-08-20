<?php

namespace Database\Factories;

use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $roomType = fake()->randomElement(['Standard', 'Deluxe', 'Suite']);

        return [
            'room_number' => fake()->unique()->numerify('###'),
            'room_type' => $roomType,
            'rental_mode' => fake()->randomElement(['short_stay', 'long_stay', 'both']),
            'price_per_night' => fake()->randomFloat(2, 15, 80),
            'price_per_month' => fake()->randomFloat(2, 250, 900),
            'status' => 'available',
            'floor' => fake()->numberBetween(1, 4),
            'max_occupants' => fake()->numberBetween(1, 4),
            'amenities' => 'Wi-Fi, Air Conditioning, Hot Water',
            'description' => fake()->sentence(),
        ];
    }
}
