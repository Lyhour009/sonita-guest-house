<?php

namespace App\Actions\Reservations;

use App\Models\Reservation;
use App\Models\Service;

class AddServiceToReservation
{
    public function handle(Reservation $reservation, Service $service, int $quantity): void
    {
        $reservation->services()->attach($service->id, [
            'quantity' => $quantity,
            'unit_price' => $service->price,
        ]);
    }
}
