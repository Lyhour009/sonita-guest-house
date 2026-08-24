<?php

namespace App\Actions\Reservations;

use App\Actions\ActivityLog\RecordActivity;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CancelReservation
{
    public function __construct(
        private readonly RecordActivity $recordActivity,
    ) {}

    public function handle(Reservation $reservation): Reservation
    {
        if (! in_array($reservation->status, ['pending', 'confirmed', 'active'], strict: true)) {
            throw ValidationException::withMessages([
                'status' => 'This reservation can no longer be cancelled.',
            ]);
        }

        $heldRoom = in_array($reservation->status, ['confirmed', 'active'], strict: true);

        return DB::transaction(function () use ($reservation, $heldRoom) {
            $reservation->update(['status' => 'cancelled']);

            if ($heldRoom) {
                $reservation->room->update(['status' => 'available']);
            }

            $this->recordActivity->handle(Auth::user(), 'reservation.cancelled', $reservation, "Cancelled reservation for Room {$reservation->room->room_number}.");

            return $reservation;
        });
    }
}
