<?php

namespace App\Actions\Reservations;

use App\Models\Reservation;
use Illuminate\Validation\ValidationException;

class CancelReservation
{
    public function handle(Reservation $reservation): Reservation
    {
        if (! in_array($reservation->status, ['pending', 'confirmed', 'active'], strict: true)) {
            throw ValidationException::withMessages([
                'status' => 'This reservation can no longer be cancelled.',
            ]);
        }

        $heldRoom = in_array($reservation->status, ['confirmed', 'active'], strict: true);

        $reservation->update(['status' => 'cancelled']);

        if ($heldRoom) {
            $reservation->room->update(['status' => 'available']);
        }

        return $reservation;
    }
}
