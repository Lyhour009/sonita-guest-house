<?php

namespace App\Actions\Reservations;

use App\Models\Room;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

class ReservationAvailability
{
    /**
     * Ensure the given room has no overlapping active reservation for the requested dates.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws ValidationException
     */
    public static function ensureAvailable(Room $room, array $data): void
    {
        $stayType = $data['reservation_type'];

        if ($stayType === 'short_stay') {
            $from = Carbon::parse($data['check_in_date']);
            $to = Carbon::parse($data['check_out_date']);
        } else {
            $from = Carbon::parse($data['start_date']);
            $to = isset($data['end_date'])
                ? Carbon::parse($data['end_date'])
                : $from->copy()->addYears(50);
        }

        $isAvailable = Room::query()
            ->whereKey($room->id)
            ->availableBetween($stayType, $from, $to)
            ->exists();

        if (! $isAvailable) {
            throw ValidationException::withMessages([
                'room_id' => 'This room is not available for the selected dates.',
            ]);
        }
    }
}
