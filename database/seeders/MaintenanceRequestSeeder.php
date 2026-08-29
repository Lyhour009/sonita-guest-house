<?php

namespace Database\Seeders;

use App\Models\MaintenanceRequest;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;

class MaintenanceRequestSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = Room::all();
        $housekeepingStaff = User::where('role', 'housekeeping')->first();
        $adminStaff = User::where('role', 'admin')->first();

        if ($rooms->isEmpty()) {
            return;
        }

        $issues = [
            ['title' => 'Aircon water leakage', 'desc' => 'Air conditioner unit in room is dripping water on floor.', 'priority' => 'high'],
            ['title' => 'Bathroom lightbulb broken', 'desc' => 'Main bulb in en-suite bathroom needs replacement.', 'priority' => 'medium'],
            ['title' => 'Water heater slow to warm', 'desc' => 'Electric water heater takes over 10 minutes to heat up.', 'priority' => 'low'],
            ['title' => 'Wi-Fi signal weak', 'desc' => 'Guest reported weak Wi-Fi reception in corner of room.', 'priority' => 'low'],
            ['title' => 'Sink drainage clogged', 'desc' => 'Bathroom basin drains very slowly.', 'priority' => 'medium'],
        ];

        // Seed 6 realistic maintenance issues
        foreach (array_slice($issues, 0, 5) as $index => $issue) {
            $room = $rooms->random();
            $status = $index === 0 ? 'pending' : ($index === 1 ? 'in_progress' : 'resolved');

            $request = MaintenanceRequest::create([
                'room_id' => $room->id,
                'reporter_id' => $adminStaff?->id,
                'assigned_to' => $status !== 'pending' ? $housekeepingStaff?->id : null,
                'title' => $issue['title'],
                'description' => $issue['desc'],
                'priority' => $issue['priority'],
                'status' => $status,
                'resolved_at' => $status === 'resolved' ? now()->subDays(rand(1, 5)) : null,
            ]);

            // Set room to 'maintenance' status if issue is currently open
            if (in_array($status, ['pending', 'in_progress']) && $index === 0) {
                $room->update(['status' => 'maintenance']);
            }
        }
    }
}
