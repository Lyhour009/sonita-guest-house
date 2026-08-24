<?php

namespace App\Actions\Reservations;

use App\Actions\ActivityLog\RecordActivity;
use App\Actions\Invoices\GenerateShortStayInvoice;
use App\Actions\Notifications\NotifyUser;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckOutReservation
{
    public function __construct(
        private readonly GenerateShortStayInvoice $generateShortStayInvoice,
        private readonly NotifyUser $notifyUser,
        private readonly RecordActivity $recordActivity,
    ) {}

    public function handle(Reservation $reservation): Reservation
    {
        if ($reservation->reservation_type !== 'short_stay' || $reservation->status !== 'checked_in') {
            throw ValidationException::withMessages([
                'status' => 'Only checked-in short-stay reservations can be checked out.',
            ]);
        }

        return DB::transaction(function () use ($reservation) {
            $reservation->update(['status' => 'checked_out']);
            $reservation->room->update(['status' => 'cleaning']);

            $this->generateShortStayInvoice->handle($reservation);

            $this->notifyUser->handle(
                $reservation->guest,
                'stay_completed',
                "Thanks for staying with us! We'd love to hear about your stay in Room {$reservation->room->room_number}.",
                ['room' => $reservation->room->room_number],
                route('dashboard'),
            );

            $this->recordActivity->handle(Auth::user(), 'reservation.checked_out', $reservation, "Checked out Room {$reservation->room->room_number}.");

            return $reservation;
        });
    }
}
