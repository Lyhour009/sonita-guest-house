<?php

namespace App\Actions\Maintenance;

use App\Actions\Notifications\NotifyUser;
use App\Models\MaintenanceRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AssignMaintenanceRequest
{
    public function __construct(
        private readonly NotifyUser $notifyUser,
    ) {}

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

        return DB::transaction(function () use ($maintenanceRequest, $assignee) {
            $maintenanceRequest->update(['assigned_to' => $assignee->id]);

            $this->notifyUser->handle(
                $assignee,
                'maintenance_assigned',
                "You've been assigned to the maintenance request \"{$maintenanceRequest->title}\" (Room {$maintenanceRequest->room->room_number}).",
                route('staff.maintenance.index'),
            );

            return $maintenanceRequest;
        });
    }
}
