<?php

namespace App\Actions\Housekeeping;

use App\Models\Room;
use Illuminate\Validation\ValidationException;

class MarkRoomCleaned
{
    public function handle(Room $room): Room
    {
        if ($room->status !== 'cleaning') {
            throw ValidationException::withMessages([
                'status' => 'Only rooms awaiting cleaning can be marked as clean.',
            ]);
        }

        $room->update(['status' => 'available']);

        return $room;
    }
}
