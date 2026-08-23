<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReservationResource;
use App\Models\Invoice;
use App\Models\MaintenanceRequest;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the role-appropriate dashboard.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard.index');
        }

        return Inertia::render('dashboard', match ($user->role) {
            'receptionist' => $this->receptionistData(),
            'housekeeping' => $this->housekeepingData($user),
            default => $this->guestData($user),
        });
    }

    /**
     * @return array<string, mixed>
     */
    private function guestData(User $guest): array
    {
        $reservations = Reservation::query()
            ->where('guest_id', $guest->id)
            ->whereIn('status', ['pending', 'confirmed', 'checked_in', 'active'])
            ->with(['room', 'invoices' => fn ($q) => $q->latest()])
            ->latest()
            ->get();

        $latestInvoice = Invoice::query()
            ->whereHas('reservation', fn ($query) => $query->where('guest_id', $guest->id))
            ->with('reservation.room')
            ->latest()
            ->first();

        $notifications = $guest->notifications()->latest()->limit(5)->get();

        return [
            'reservations' => ReservationResource::collection($reservations)->resolve(),
            'latestInvoice' => $latestInvoice ? [
                'id' => $latestInvoice->id,
                'invoice_type' => $latestInvoice->invoice_type,
                'total_amount' => $latestInvoice->total_amount,
                'status' => $latestInvoice->status,
                'due_date' => $latestInvoice->due_date?->toDateString(),
                'room' => [
                    'room_number' => $latestInvoice->reservation->room->room_number,
                ],
            ] : null,
            'notifications' => $notifications->map(fn ($notification) => [
                'id' => $notification->id,
                'type' => $notification->type,
                'message' => $notification->message,
                'data' => $notification->data ?? [],
                'link' => $notification->link,
                'is_read' => $notification->is_read,
                'created_at' => $notification->created_at?->toDateTimeString(),
            ]),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function receptionistData(): array
    {
        $today = now()->toDateString();

        $arrivals = Reservation::query()
            ->where('reservation_type', 'short_stay')
            ->whereDate('check_in_date', $today)
            ->where('status', 'confirmed')
            ->with(['guest', 'room'])
            ->get();

        $departures = Reservation::query()
            ->where('reservation_type', 'short_stay')
            ->whereDate('check_out_date', $today)
            ->where('status', 'checked_in')
            ->with(['guest', 'room'])
            ->get();

        return [
            'arrivals' => $arrivals->map(fn (Reservation $reservation) => [
                'id' => $reservation->id,
                'guest' => ['full_name' => $reservation->guest->full_name],
                'room' => ['room_number' => $reservation->room->room_number],
            ]),
            'departures' => $departures->map(fn (Reservation $reservation) => [
                'id' => $reservation->id,
                'guest' => ['full_name' => $reservation->guest->full_name],
                'room' => ['room_number' => $reservation->room->room_number],
            ]),
            'rooms' => Room::query()->orderBy('room_number')->get(['id', 'room_number', 'status']),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function housekeepingData(User $user): array
    {
        return [
            'roomsAwaitingCleaning' => Room::query()->where('status', 'cleaning')->count(),
            'openAssignedMaintenance' => MaintenanceRequest::query()
                ->where('assigned_to', $user->id)
                ->whereIn('status', ['pending', 'in_progress'])
                ->count(),
        ];
    }
}
