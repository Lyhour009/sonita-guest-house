<?php

namespace Database\Factories;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'causer_id' => User::factory()->admin(),
            'action' => 'room.created',
            'subject_type' => 'App\\Models\\Room',
            'subject_id' => (string) Str::uuid(),
            'description' => fake()->sentence(),
            'properties' => [],
            'created_at' => now(),
        ];
    }
}
