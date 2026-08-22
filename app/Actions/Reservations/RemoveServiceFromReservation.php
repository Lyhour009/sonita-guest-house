<?php

namespace App\Actions\Reservations;

use App\Models\Reservation;
use App\Models\Service;

class RemoveServiceFromReservation
{
    public function handle(Reservation $reservation, Service $service): void
    {
        $reservation->services()->detach($service->id);
    }
}
