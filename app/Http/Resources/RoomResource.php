<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class RoomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'room_number' => $this->room_number,
            'room_type' => $this->room_type,
            'rental_mode' => $this->rental_mode,
            'status' => $this->status,
            'floor' => $this->floor,
            'price_per_night' => (float) $this->price_per_night,
            'price_per_month' => (float) $this->price_per_month,
            'max_occupants' => $this->max_occupants,
            'amenities' => $this->whenNotNull($this->amenities),
            'description' => $this->whenNotNull($this->description),
            'notes' => $this->whenNotNull($this->notes),
            'images' => $this->whenLoaded('roomImages', fn () => $this->roomImages->map(fn ($image) => [
                'id' => $image->id,
                'url' => Storage::disk('public')->url($image->image_path),
            ])),
            'thumbnail' => $this->whenLoaded('roomImages', fn () => $this->roomImages->first()
                ? Storage::disk('public')->url($this->roomImages->first()->image_path)
                : null
            ),
            'average_rating' => $this->reviews_avg_rating !== null ? round((float) $this->reviews_avg_rating, 1) : null,
            'reviews_count' => (int) ($this->reviews_count ?? 0),
            'recent_reviews' => $this->whenLoaded('reviews', fn () => $this->reviews->map(fn ($review) => [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'guest_name' => $review->guest?->full_name ?? 'Guest',
                'created_at' => $review->created_at?->format('M d, Y'),
            ])),
        ];
    }
}
