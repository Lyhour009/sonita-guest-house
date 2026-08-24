<?php

namespace App\Actions\Reservations;

use App\Actions\ActivityLog\RecordActivity;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckInReservation
{
    public function __construct(
        private readonly RecordActivity $recordActivity,
    ) {}

    public function handle(Reservation $reservation): Reservation
    {
        if ($reservation->reservation_type !== 'short_stay' || $reservation->status !== 'confirmed') {
            throw ValidationException::withMessages([
                'status' => 'Only confirmed short-stay reservations can be checked in.',
            ]);
        }

        return DB::transaction(function () use ($reservation) {
            $reservation->update(['status' => 'checked_in']);
            $reservation->room->update(['status' => 'occupied']);

            $this->recordActivity->handle(Auth::user(), 'reservation.checked_in', $reservation, "Checked in Room {$reservation->room->room_number}.");

            return $reservation;
        });
    }
}
