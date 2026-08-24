<?php

namespace App\Actions\Reservations;

use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateWalkInReservation
{
    /**
     * Create an immediately-confirmed walk-in reservation, creating the guest account
     * inline when one wasn't picked from the existing guest list.
     *
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): Reservation
    {
        $room = Room::findOrFail((string) $data['room_id']);

        ReservationAvailability::ensureAvailable($room, $data);

        return DB::transaction(function () use ($room, $data) {
            $guest = isset($data['guest_id'])
                ? User::findOrFail((string) $data['guest_id'])
                : User::create([
                    'role' => 'guest',
                    'full_name' => $data['new_guest']['full_name'],
                    'email' => $data['new_guest']['email'],
                    'password' => Str::password(),
                ]);

            $status = $data['reservation_type'] === 'long_stay' ? 'active' : 'confirmed';

            $reservation = $room->reservations()->create([
                'guest_id' => $guest->id,
                'reservation_type' => $data['reservation_type'],
                'check_in_date' => $data['check_in_date'] ?? null,
                'check_out_date' => $data['check_out_date'] ?? null,
                'start_date' => $data['start_date'] ?? null,
                'end_date' => $data['end_date'] ?? null,
                'num_guests' => $data['num_guests'] ?? null,
                'status' => $status,
                'promo_code' => $data['promo_code'] ?? null,
            ]);

            $room->update([
                'status' => $data['reservation_type'] === 'long_stay' ? 'occupied' : 'reserved',
            ]);

            return $reservation;
        });
    }
}
