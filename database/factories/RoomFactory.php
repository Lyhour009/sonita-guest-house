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
        return [
            'room_number' => fake()->unique()->numerify('###'),
            'room_type' => fake()->randomElement(['Standard', 'Deluxe', 'Suite', 'Family']),
            'rental_mode' => fake()->randomElement(['short_stay', 'long_stay', 'both']),
            'price_per_night' => fake()->randomFloat(2, 15, 45),
            'price_per_month' => fake()->randomFloat(2, 250, 600),
            'status' => 'available',
            'floor' => fake()->numberBetween(1, 5),
            'max_occupants' => fake()->numberBetween(1, 4),
            'amenities' => 'Wi-Fi, Air Conditioning, Hot Water, Smart TV, Fridge',
            'description' => fake()->sentence(),
        ];
    }
}
