<?php

namespace App\Actions\Reservations;

use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;

class CreateGuestReservation
{
    /**
     * Create a pending reservation for a guest, enforcing the no-double-booking rule.
     *
     * @param  array<string, mixed>  $data
     */
    public function handle(User $guest, array $data): Reservation
    {
        $room = Room::findOrFail((string) $data['room_id']);

        ReservationAvailability::ensureAvailable($room, $data);

        return $room->reservations()->create([
            'guest_id' => $guest->id,
            'reservation_type' => $data['reservation_type'],
            'check_in_date' => $data['check_in_date'] ?? null,
            'check_out_date' => $data['check_out_date'] ?? null,
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'num_guests' => $data['num_guests'] ?? null,
            'status' => 'pending',
            'promo_code' => $data['promo_code'] ?? null,
        ]);
    }
}
