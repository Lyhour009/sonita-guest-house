<?php

namespace App\Actions\Maintenance;

use App\Models\MaintenanceRequest;
use Illuminate\Validation\ValidationException;

class UpdateMaintenanceRequestStatus
{
    public function handle(MaintenanceRequest $maintenanceRequest, string $status): MaintenanceRequest
    {
        if (in_array($maintenanceRequest->status, ['resolved', 'cancelled'], strict: true)) {
            throw ValidationException::withMessages([
                'status' => 'This request has already been closed.',
            ]);
        }

        $maintenanceRequest->update([
            'status' => $status,
            'resolved_at' => $status === 'resolved' ? now() : null,
        ]);

        if (in_array($status, ['resolved', 'cancelled'], strict: true)) {
            $room = $maintenanceRequest->room;

            if ($room->status === 'maintenance') {
                $room->update(['status' => 'available']);
            }
        }

        return $maintenanceRequest;
    }
}
