<?php

namespace App\Actions\Reservations;

use App\Models\Reservation;

class UpdateReservationNotes
{
    public function handle(Reservation $reservation, ?string $notes): Reservation
    {
        $reservation->update(['notes' => $notes]);

        return $reservation;
    }
}
