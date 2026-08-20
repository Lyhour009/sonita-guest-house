<?php

namespace App\Http\Controllers;

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
            'rooms' => $rooms->through(fn (Room $room) => $this->roomSummary($room)),
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
            'room' => [
                'id' => $room->id,
                'room_number' => $room->room_number,
                'room_type' => $room->room_type,
                'rental_mode' => $room->rental_mode,
                'price_per_night' => $room->price_per_night,
                'price_per_month' => $room->price_per_month,
                'floor' => $room->floor,
                'max_occupants' => $room->max_occupants,
                'amenities' => $room->amenities,
                'description' => $room->description,
                'images' => $room->roomImages->map(fn ($image) => [
                    'id' => $image->id,
                    'url' => Storage::disk('public')->url($image->image_path),
                ]),
            ],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function roomSummary(Room $room): array
    {
        return [
            'id' => $room->id,
            'room_number' => $room->room_number,
            'room_type' => $room->room_type,
            'rental_mode' => $room->rental_mode,
            'price_per_night' => $room->price_per_night,
            'price_per_month' => $room->price_per_month,
            'max_occupants' => $room->max_occupants,
            'thumbnail' => $room->roomImages->first()
                ? Storage::disk('public')->url($room->roomImages->first()->image_path)
                : null,
        ];
    }
}
