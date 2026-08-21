<?php

namespace App\Actions\Maintenance;

use App\Models\MaintenanceRequest;
use App\Models\Room;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SubmitMaintenanceRequest
{
    /**
     * @param  array{room_id: string, title: string, description?: string|null, priority: string}  $data
     */
    public function handle(User $reporter, array $data): MaintenanceRequest
    {
        $room = Room::findOrFail((string) $data['room_id']);

        return DB::transaction(function () use ($room, $reporter, $data) {
            $request = $room->maintenanceRequests()->create([
                'reporter_id' => $reporter->id,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'priority' => $data['priority'],
                'status' => 'pending',
            ]);

            if (in_array($room->status, ['available', 'cleaning'], strict: true)) {
                $room->update(['status' => 'maintenance']);
            }

            return $request;
        });
    }
}
