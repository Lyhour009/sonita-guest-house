<?php

namespace App\Actions\Maintenance;

use App\Actions\Notifications\NotifyUser;
use App\Models\MaintenanceRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UpdateMaintenanceRequestStatus
{
    public function __construct(
        private readonly NotifyUser $notifyUser,
    ) {}

    public function handle(MaintenanceRequest $maintenanceRequest, string $status): MaintenanceRequest
    {
        if (in_array($maintenanceRequest->status, ['resolved', 'cancelled'], strict: true)) {
            throw ValidationException::withMessages([
                'status' => 'This request has already been closed.',
            ]);
        }

        return DB::transaction(function () use ($maintenanceRequest, $status) {
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

            $this->notifyUser->handle(
                $maintenanceRequest->reporter,
                'maintenance_status_changed',
                "Your maintenance request \"{$maintenanceRequest->title}\" is now {$status}.",
                route('maintenance.index'),
            );

            return $maintenanceRequest;
        });
    }
}
