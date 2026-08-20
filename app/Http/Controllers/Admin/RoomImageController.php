<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RoomImageStoreRequest;
use App\Models\Room;
use App\Models\RoomImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RoomImageController extends Controller
{
    /**
     * Upload one or more images for a room.
     */
    public function store(RoomImageStoreRequest $request, Room $room): RedirectResponse
    {
        foreach ($request->file('images', []) as $image) {
            $room->roomImages()->create([
                'image_path' => $image->store("rooms/{$room->id}", 'public'),
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Images uploaded.')]);

        return back();
    }

    /**
     * Delete a room image.
     */
    public function destroy(Room $room, RoomImage $roomImage): RedirectResponse
    {
        Storage::disk('public')->delete($roomImage->image_path);

        $roomImage->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Image removed.')]);

        return back();
    }
}
