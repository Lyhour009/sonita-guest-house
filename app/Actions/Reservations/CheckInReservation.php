<?php

namespace App\Actions\Reservations;

use App\Models\Reservation;
use Illuminate\Validation\ValidationException;

class CheckInReservation
{
    public function handle(Reservation $reservation): Reservation
    {
        if ($reservation->reservation_type !== 'short_stay' || $reservation->status !== 'confirmed') {
            throw ValidationException::withMessages([
                'status' => 'Only confirmed short-stay reservations can be checked in.',
            ]);
        }

        $reservation->update(['status' => 'checked_in']);
        $reservation->room->update(['status' => 'occupied']);

        return $reservation;
    }
}
