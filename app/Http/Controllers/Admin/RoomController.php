<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RoomStoreRequest;
use App\Http\Requests\Admin\RoomUpdateRequest;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    /**
     * Display the admin room listing.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'rental_mode' => ['nullable', 'string', 'in:short_stay,long_stay,both'],
            'status' => ['nullable', 'string', 'in:available,occupied,reserved,cleaning,maintenance'],
        ]);

        $rooms = Room::query()
            ->with('roomImages')
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query->where(
                fn ($query) => $query->where('room_number', 'like', "%{$search}%")
                    ->orWhere('room_type', 'like', "%{$search}%"),
            ))
            ->when($filters['rental_mode'] ?? null, fn ($query, string $mode) => $query->where('rental_mode', $mode))
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->orderBy('room_number')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/rooms/index', [
            'rooms' => $rooms->through(fn (Room $room) => $this->roomPayload($room)),
            'filters' => [
                'search' => $filters['search'] ?? null,
                'rental_mode' => $filters['rental_mode'] ?? null,
                'status' => $filters['status'] ?? null,
            ],
        ]);
    }

    /**
     * Store a newly created room.
     */
    public function store(RoomStoreRequest $request): RedirectResponse
    {
        $room = Room::create($request->safe()->except('images'));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store("rooms/{$room->id}", 'public');
                $room->roomImages()->create(['image_path' => $path]);
            }
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Room created.')]);

        return to_route('admin.rooms.index');
    }

    /**
     * Update a room.
     */
    public function update(RoomUpdateRequest $request, Room $room): RedirectResponse
    {
        $room->update($request->safe()->except('images'));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store("rooms/{$room->id}", 'public');
                $room->roomImages()->create(['image_path' => $path]);
            }
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Room updated.')]);

        return to_route('admin.rooms.index');
    }

    /**
     * Delete a room.
     */
    public function destroy(Room $room): RedirectResponse
    {
        foreach ($room->roomImages as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $room->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Room deleted.')]);

        return to_route('admin.rooms.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function roomPayload(Room $room): array
    {
        return [
            'id' => $room->id,
            'room_number' => $room->room_number,
            'room_type' => $room->room_type,
            'rental_mode' => $room->rental_mode,
            'price_per_night' => $room->price_per_night,
            'price_per_month' => $room->price_per_month,
            'status' => $room->status,
            'floor' => $room->floor,
            'max_occupants' => $room->max_occupants,
            'amenities' => $room->amenities,
            'description' => $room->description,
            'images' => $room->roomImages->map(fn ($image) => [
                'id' => $image->id,
                'url' => Storage::disk('public')->url($image->image_path),
            ]),
        ];
    }
}
