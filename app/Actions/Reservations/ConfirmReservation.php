<?php

namespace App\Actions\Reservations;

use App\Actions\Notifications\NotifyUser;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ConfirmReservation
{
    public function __construct(
        private readonly NotifyUser $notifyUser,
    ) {}

    public function handle(Reservation $reservation): Reservation
    {
        if ($reservation->status !== 'pending') {
            throw ValidationException::withMessages([
                'status' => 'Only pending reservations can be confirmed.',
            ]);
        }

        $isLongStay = $reservation->reservation_type === 'long_stay';

        return DB::transaction(function () use ($reservation, $isLongStay) {
            $reservation->update([
                'status' => $isLongStay ? 'active' : 'confirmed',
            ]);

            $reservation->room->update([
                'status' => $isLongStay ? 'occupied' : 'reserved',
            ]);

            $this->notifyUser->handle(
                $reservation->guest,
                'reservation_confirmed',
                "Your reservation for Room {$reservation->room->room_number} has been confirmed.",
                route('reservations.index'),
            );

            return $reservation;
        });
    }
}
