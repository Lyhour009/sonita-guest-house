<?php

namespace App\Http\Controllers\Staff;

use App\Actions\Reservations\AddServiceToReservation;
use App\Actions\Reservations\RemoveServiceFromReservation;
use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\ReservationServiceStoreRequest;
use App\Models\Reservation;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ReservationServiceController extends Controller
{
    /**
     * Attach a service to the reservation.
     */
    public function store(ReservationServiceStoreRequest $request, Reservation $reservation, AddServiceToReservation $action): RedirectResponse
    {
        $service = Service::findOrFail((string) $request->validated('service_id'));

        $action->handle($reservation, $service, (int) $request->validated('quantity'));

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.reservations.serviceAdded']);

        return back();
    }

    /**
     * Remove a service from the reservation.
     */
    public function destroy(Reservation $reservation, Service $service, RemoveServiceFromReservation $action): RedirectResponse
    {
        $action->handle($reservation, $service);

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.reservations.serviceRemoved']);

        return back();
    }
}
