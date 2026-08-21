<?php

namespace App\Actions\Reservations;

use App\Actions\Invoices\GenerateShortStayInvoice;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckOutReservation
{
    public function __construct(
        private readonly GenerateShortStayInvoice $generateShortStayInvoice,
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

            return $reservation;
        });
    }
}
