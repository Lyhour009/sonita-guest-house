<?php

namespace App\Actions\Reviews;

use App\Models\Reservation;
use App\Models\Review;
use App\Models\User;

class CreateReview
{
    /**
     * Record a guest's review of their completed stay.
     */
    public function handle(Reservation $reservation, User $guest, int $rating, ?string $comment): Review
    {
        return Review::create([
            'reservation_id' => $reservation->id,
            'guest_id' => $guest->id,
            'rating' => $rating,
            'comment' => $comment,
        ]);
    }
}
