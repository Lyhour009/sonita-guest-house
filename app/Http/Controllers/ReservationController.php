<?php

namespace App\Http\Controllers;

use App\Actions\Reservations\CancelReservation;
use App\Actions\Reservations\CreateGuestReservation;
use App\Http\Requests\ReservationStoreRequest;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    /**
     * Display the authenticated guest's reservations.
     */
    public function index(Request $request): Response
    {
        $reservations = $request->user()
            ->reservations()
            ->with('room')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('reservations/index', [
            'reservations' => $reservations->through(fn (Reservation $reservation) => [
                'id' => $reservation->id,
                'reservation_type' => $reservation->reservation_type,
                'check_in_date' => $reservation->check_in_date?->toDateString(),
                'check_out_date' => $reservation->check_out_date?->toDateString(),
                'start_date' => $reservation->start_date?->toDateString(),
                'end_date' => $reservation->end_date?->toDateString(),
                'status' => $reservation->status,
                'room' => [
                    'id' => $reservation->room->id,
                    'room_number' => $reservation->room->room_number,
                    'room_type' => $reservation->room->room_type,
                ],
            ]),
        ]);
    }

    /**
     * Book a room.
     */
    public function store(ReservationStoreRequest $request, CreateGuestReservation $action): RedirectResponse
    {
        $action->handle($request->user(), $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Reservation requested — awaiting confirmation.')]);

        return to_route('reservations.index');
    }

    /**
     * Cancel the authenticated guest's own reservation.
     */
    public function cancel(Request $request, Reservation $reservation, CancelReservation $action): RedirectResponse
    {
        abort_unless($reservation->guest_id === $request->user()->id, 403);

        $action->handle($reservation);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Reservation cancelled.')]);

        return to_route('reservations.index');
    }
}
