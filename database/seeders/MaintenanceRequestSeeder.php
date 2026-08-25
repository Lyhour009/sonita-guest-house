<?php

namespace Database\Seeders;

use App\Actions\Maintenance\AssignMaintenanceRequest;
use App\Actions\Maintenance\SubmitMaintenanceRequest;
use App\Actions\Maintenance\UpdateMaintenanceRequestStatus;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;

class MaintenanceRequestSeeder extends Seeder
{
    public function run(): void
    {
        $submitMaintenanceRequest = app(SubmitMaintenanceRequest::class);
        $assignMaintenanceRequest = app(AssignMaintenanceRequest::class);
        $updateMaintenanceRequestStatus = app(UpdateMaintenanceRequestStatus::class);

        $guests = User::where('role', 'guest')->get();
        $receptionist = User::where('role', 'receptionist')->first();
        $housekeepers = User::where('role', 'housekeeping')->get();
        $rooms = Room::all();

        if ($guests->isEmpty() || $rooms->isEmpty() || $housekeepers->isEmpty()) {
            $this->command->warn('Missing guests, rooms, or housekeeping staff. Skipping maintenance request seeding.');

            return;
        }

        $reporters = $receptionist ? $guests->concat([$receptionist]) : $guests;

        $issues = [
            ['title' => 'Air conditioner not cooling', 'priority' => 'high'],
            ['title' => 'Leaking bathroom faucet', 'priority' => 'medium'],
            ['title' => 'Light bulb replacement needed', 'priority' => 'low'],
            ['title' => 'Wi-Fi router not working', 'priority' => 'medium'],
            ['title' => 'Blocked toilet', 'priority' => 'high'],
            ['title' => 'Broken door lock', 'priority' => 'high'],
            ['title' => 'Hot water not working', 'priority' => 'high'],
            ['title' => 'TV remote missing batteries', 'priority' => 'low'],
            ['title' => 'Mosquito net has a tear', 'priority' => 'medium'],
            ['title' => 'Ceiling fan making noise', 'priority' => 'low'],
            ['title' => 'Window will not close properly', 'priority' => 'medium'],
            ['title' => 'Mini fridge not cooling', 'priority' => 'medium'],
            ['title' => 'Shower drain is clogged', 'priority' => 'medium'],
            ['title' => 'Curtain rail fell down', 'priority' => 'low'],
            ['title' => 'Power outlet not working', 'priority' => 'high'],
        ];

        for ($i = 0; $i < 50; $i++) {
            $issue = $issues[array_rand($issues)];

            $request = $submitMaintenanceRequest->handle($reporters->random(), [
                'room_id' => $rooms->random()->id,
                'title' => $issue['title'],
                'priority' => $issue['priority'],
            ]);

            $roll = rand(1, 100);

            // Left pending, so staff have real unassigned requests to triage.
            if ($roll <= 20) {
                continue;
            }

            $assignMaintenanceRequest->handle($request, $housekeepers->random());

            if ($roll <= 50) {
                $updateMaintenanceRequestStatus->handle($request, 'in_progress');
            } elseif ($roll <= 90) {
                $updateMaintenanceRequestStatus->handle($request, 'in_progress');
                $updateMaintenanceRequestStatus->handle($request, 'resolved');
            } else {
                $updateMaintenanceRequestStatus->handle($request, 'cancelled');
            }
        }
    }
}
