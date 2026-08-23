<?php

namespace App\Http\Controllers\Staff;

use App\Actions\Housekeeping\MarkRoomCleaned;
use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HousekeepingController extends Controller
{
    /**
     * Display rooms currently awaiting cleaning.
     */
    public function index(): Response
    {
        $rooms = Room::query()
            ->where('status', 'cleaning')
            ->orderBy('room_number')
            ->get(['id', 'room_number', 'room_type', 'floor', 'notes']);

        return Inertia::render('staff/housekeeping/index', [
            'rooms' => $rooms,
        ]);
    }

    /**
     * Mark a room as cleaned and available again.
     */
    public function markClean(Room $room, MarkRoomCleaned $action): RedirectResponse
    {
        $action->handle($room);

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.housekeeping.roomCleaned']);

        return back();
    }
}
