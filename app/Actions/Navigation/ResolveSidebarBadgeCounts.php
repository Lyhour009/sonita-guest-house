<?php

namespace App\Actions\Navigation;

use App\Models\Invoice;
use App\Models\MaintenanceRequest;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;

class ResolveSidebarBadgeCounts
{
    /**
     * Counts shown as sidebar nav badges, scoped to what each role can act on.
     *
     * @return array<string, int>
     */
    public function handle(User $user): array
    {
        return match ($user->role) {
            'admin' => [
                'reservationsPending' => Reservation::query()->where('status', 'pending')->count(),
                'paymentsPending' => Payment::query()->where('status', 'pending')->count(),
                'roomsAwaitingCleaning' => Room::query()->where('status', 'cleaning')->count(),
                'maintenanceOpen' => MaintenanceRequest::query()->whereIn('status', ['pending', 'in_progress'])->count(),
            ],
            'receptionist' => [
                'reservationsPending' => Reservation::query()->where('status', 'pending')->count(),
                'paymentsPending' => Payment::query()->where('status', 'pending')->count(),
            ],
            'housekeeping' => [
                'roomsAwaitingCleaning' => Room::query()->where('status', 'cleaning')->count(),
                'maintenanceOpen' => MaintenanceRequest::query()
                    ->where('assigned_to', $user->id)
                    ->whereIn('status', ['pending', 'in_progress'])
                    ->count(),
            ],
            'guest' => [
                'unpaidInvoices' => Invoice::query()
                    ->whereHas('reservation', fn ($query) => $query->where('guest_id', $user->id))
                    ->whereIn('status', ['unpaid', 'partial', 'overdue'])
                    ->count(),
            ],
            default => [],
        };
    }
}
