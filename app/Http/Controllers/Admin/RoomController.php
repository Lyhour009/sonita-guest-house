<?php

namespace App\Http\Controllers\Admin;

use App\Actions\ActivityLog\RecordActivity;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RoomStoreRequest;
use App\Http\Requests\Admin\RoomUpdateRequest;
use App\Http\Resources\RoomResource;
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

        $statusCounts = [
            'all' => Room::count(),
            'available' => Room::where('status', 'available')->count(),
            'occupied' => Room::where('status', 'occupied')->count(),
            'maintenance' => Room::where('status', 'maintenance')->count(),
        ];

        return Inertia::render('admin/rooms/index', [
            'rooms' => RoomResource::collection($rooms),
            'filters' => [
                'search' => $filters['search'] ?? null,
                'rental_mode' => $filters['rental_mode'] ?? null,
                'status' => $filters['status'] ?? null,
            ],
            'statusCounts' => $statusCounts,
        ]);
    }

    /**
     * Store a newly created room.
     */
    public function store(RoomStoreRequest $request, RecordActivity $recordActivity): RedirectResponse
    {
        $room = Room::create($request->safe()->except('images'));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store("rooms/{$room->id}", 'public');
                $room->roomImages()->create(['image_path' => $path]);
            }
        }

        $recordActivity->handle($request->user(), 'room.created', $room, "Created room {$room->room_number}.");

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.rooms.created']);

        return to_route('admin.rooms.index');
    }

    /**
     * Update a room.
     */
    public function update(RoomUpdateRequest $request, Room $room, RecordActivity $recordActivity): RedirectResponse
    {
        $room->update($request->safe()->except('images'));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store("rooms/{$room->id}", 'public');
                $room->roomImages()->create(['image_path' => $path]);
            }
        }

        $recordActivity->handle($request->user(), 'room.updated', $room, "Updated room {$room->room_number}.");

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.rooms.updated']);

        return to_route('admin.rooms.index');
    }

    /**
     * Delete a room.
     */
    public function destroy(Request $request, Room $room, RecordActivity $recordActivity): RedirectResponse
    {
        foreach ($room->roomImages as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $roomNumber = $room->room_number;
        $room->delete();

        $recordActivity->handle($request->user(), 'room.deleted', $room, "Deleted room {$roomNumber}.");

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.rooms.deleted']);

        return to_route('admin.rooms.index');
    }
}
