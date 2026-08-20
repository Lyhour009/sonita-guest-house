<?php

namespace App\Actions\Maintenance;

use App\Models\MaintenanceRequest;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AssignMaintenanceRequest
{
    public function handle(MaintenanceRequest $maintenanceRequest, User $assignee): MaintenanceRequest
    {
        if (in_array($maintenanceRequest->status, ['resolved', 'cancelled'], strict: true)) {
            throw ValidationException::withMessages([
                'assigned_to' => 'This request has already been closed and cannot be reassigned.',
            ]);
        }

        if ($assignee->role !== 'housekeeping') {
            throw ValidationException::withMessages([
                'assigned_to' => 'Maintenance requests can only be assigned to housekeeping staff.',
            ]);
        }

        $maintenanceRequest->update(['assigned_to' => $assignee->id]);

        return $maintenanceRequest;
    }
}
