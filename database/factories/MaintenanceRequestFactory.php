<?php

namespace Database\Factories;

use App\Models\MaintenanceRequest;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MaintenanceRequest>
 */
class MaintenanceRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reporter_id' => User::factory(),
            'room_id' => Room::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'priority' => 'medium',
            'status' => 'pending',
            'assigned_to' => null,
            'resolved_at' => null,
        ];
    }

    /**
     * Indicate that the request is high priority.
     */
    public function highPriority(): static
    {
        return $this->state(fn (array $attributes) => ['priority' => 'high']);
    }

    /**
     * Indicate that the request has been resolved.
     */
    public function resolved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'resolved',
            'resolved_at' => now(),
        ]);
    }

    /**
     * Indicate that the request has been cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'cancelled']);
    }
}
