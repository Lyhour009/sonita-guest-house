<?php

namespace App\Actions\Reservations;

use App\Models\Reservation;
use Illuminate\Validation\ValidationException;

class ConfirmReservation
{
    public function handle(Reservation $reservation): Reservation
    {
        if ($reservation->status !== 'pending') {
            throw ValidationException::withMessages([
                'status' => 'Only pending reservations can be confirmed.',
            ]);
        }

        $isLongStay = $reservation->reservation_type === 'long_stay';

        $reservation->update([
            'status' => $isLongStay ? 'active' : 'confirmed',
        ]);

        $reservation->room->update([
            'status' => $isLongStay ? 'occupied' : 'reserved',
        ]);

        return $reservation;
    }
}
