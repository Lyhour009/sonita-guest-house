<?php

namespace App\Http\Controllers\Staff;

use App\Actions\Reservations\CancelReservation;
use App\Actions\Reservations\CheckInReservation;
use App\Actions\Reservations\CheckOutReservation;
use App\Actions\Reservations\ConfirmReservation;
use App\Actions\Reservations\CreateWalkInReservation;
use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\ReservationStoreRequest;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    /**
     * Display every reservation for front-desk oversight.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:pending,confirmed,checked_in,checked_out,active,expired,cancelled,terminated'],
        ]);

        $reservations = Reservation::query()
            ->with(['guest', 'room'])
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query->where(
                fn ($query) => $query
                    ->whereHas('guest', fn ($guest) => $guest->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%"))
                    ->orWhereHas('room', fn ($room) => $room->where('room_number', 'like', "%{$search}%")),
            ))
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $statusCounts = [
            'all' => Reservation::query()->count(),
            'pending' => Reservation::query()->where('status', 'pending')->count(),
            'confirmed' => Reservation::query()->where('status', 'confirmed')->count(),
            'checked_in' => Reservation::query()->where('status', 'checked_in')->count(),
            'active' => Reservation::query()->where('status', 'active')->count(),
            'checked_out' => Reservation::query()->where('status', 'checked_out')->count(),
            'cancelled' => Reservation::query()->where('status', 'cancelled')->count(),
        ];

        return Inertia::render('staff/reservations/index', [
            'reservations' => $reservations->through(fn (Reservation $reservation) => [
                'id' => $reservation->id,
                'reservation_type' => $reservation->reservation_type,
                'check_in_date' => $reservation->check_in_date?->toDateString(),
                'check_out_date' => $reservation->check_out_date?->toDateString(),
                'start_date' => $reservation->start_date?->toDateString(),
                'end_date' => $reservation->end_date?->toDateString(),
                'status' => $reservation->status,
                'guest' => [
                    'id' => $reservation->guest->id,
                    'full_name' => $reservation->guest->full_name,
                    'email' => $reservation->guest->email,
                ],
                'room' => [
                    'id' => $reservation->room->id,
                    'room_number' => $reservation->room->room_number,
                    'room_type' => $reservation->room->room_type,
                ],
            ]),
            'filters' => [
                'search' => $filters['search'] ?? null,
                'status' => $filters['status'] ?? null,
            ],
            'statusCounts' => $statusCounts,
            'guests' => User::query()
                ->where('role', 'guest')
                ->orderBy('full_name')
                ->get(['id', 'full_name', 'email']),
            'rooms' => Room::query()
                ->where('status', '!=', 'maintenance')
                ->orderBy('room_number')
                ->get(['id', 'room_number', 'room_type', 'rental_mode', 'max_occupants']),
        ]);
    }

    /**
     * Create a walk-in booking.
     */
    public function store(ReservationStoreRequest $request, CreateWalkInReservation $action): RedirectResponse
    {
        $action->handle($request->validated());

        return back()->with('success', 'Reservation created successfully.');
    }

    /**
     * Confirm a pending reservation.
     */
    public function confirm(Reservation $reservation, ConfirmReservation $action): RedirectResponse
    {
        $action->handle($reservation);

        return back()->with('success', 'Reservation confirmed.');
    }

    /**
     * Check in a guest for an active stay.
     */
    public function checkIn(Reservation $reservation, CheckInReservation $action): RedirectResponse
    {
        $action->handle($reservation);

        return back()->with('success', 'Guest checked in.');
    }

    /**
     * Check out a guest.
     */
    public function checkOut(Reservation $reservation, CheckOutReservation $action): RedirectResponse
    {
        $action->handle($reservation);

        return back()->with('success', 'Guest checked out.');
    }

    /**
     * Cancel a reservation.
     */
    public function cancel(Reservation $reservation, CancelReservation $action): RedirectResponse
    {
        $action->handle($reservation);

        return back()->with('success', 'Reservation cancelled.');
    }
}
