<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoomResource;
use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    /**
     * Display the public room browse page.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'stay_type' => ['nullable', 'string', 'in:short_stay,long_stay'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after:from'],
        ]);

        $query = Room::query()->where('status', '!=', 'maintenance');

        if (isset($filters['stay_type'])) {
            $query->whereIn('rental_mode', [$filters['stay_type'], 'both']);
        }

        if (isset($filters['stay_type'], $filters['from'], $filters['to'])) {
            $query->availableBetween(
                $filters['stay_type'],
                Carbon::parse($filters['from']),
                Carbon::parse($filters['to']),
            );
        }

        $rooms = $query->with('roomImages')
            ->orderBy('room_number')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('welcome', [
            'rooms' => RoomResource::collection($rooms),
            'filters' => [
                'stay_type' => $filters['stay_type'] ?? null,
                'from' => $filters['from'] ?? null,
                'to' => $filters['to'] ?? null,
            ],
        ]);
    }

    /**
     * Display a single room's public detail page.
     */
    public function show(Room $room): Response
    {
        $room->load('roomImages');

        return Inertia::render('rooms/show', [
            'room' => (new RoomResource($room))->resolve(),
            'bookedRanges' => $this->bookedRanges($room),
        ]);
    }

    /**
     * Booked date ranges for this room over the next 12 months, for the availability calendar.
     *
     * @return array<int, array{start: string, end: string}>
     */
    private function bookedRanges(Room $room): array
    {
        $windowStart = now()->startOfDay();
        $windowEnd = now()->addMonths(12)->endOfDay();

        return $room->reservations()
            ->whereIn('status', ['pending', 'confirmed', 'checked_in', 'active'])
            ->where(function ($query) use ($windowStart, $windowEnd) {
                $query->where(function ($shortStay) use ($windowStart, $windowEnd) {
                    $shortStay->where('check_in_date', '<', $windowEnd)
                        ->where('check_out_date', '>', $windowStart);
                })->orWhere(function ($longStay) use ($windowStart, $windowEnd) {
                    $longStay->where('start_date', '<', $windowEnd)
                        ->where(function ($openEnded) use ($windowStart) {
                            $openEnded->whereNull('end_date')->orWhere('end_date', '>', $windowStart);
                        });
                });
            })
            ->get()
            ->map(function (Reservation $reservation) use ($windowEnd) {
                $start = $reservation->check_in_date ?? $reservation->start_date;
                $end = $reservation->check_out_date ?? $reservation->end_date ?? $windowEnd;

                return [
                    'start' => $start->toDateString(),
                    'end' => $end->min($windowEnd)->toDateString(),
                ];
            })
            ->all();
    }

}
