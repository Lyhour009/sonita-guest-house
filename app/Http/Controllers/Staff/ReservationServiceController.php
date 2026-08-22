<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationServiceController extends Controller
{
    /**
     * Attach a service to the reservation.
     */
    public function store(Request $request, Reservation $reservation): RedirectResponse
    {
        $validated = $request->validate([
            'service_id' => 'required|uuid|exists:services,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $service = Service::findOrFail($validated['service_id']);

        $reservation->services()->attach($service->id, [
            'quantity' => $validated['quantity'],
            'unit_price' => $service->price,
        ]);

        // Dynamically increment total_amount
        $reservation->increment('total_amount', $service->price * $validated['quantity']);

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.reservations.serviceAdded']);

        return back();
    }

    /**
     * Remove a service from the reservation.
     */
    public function destroy(Reservation $reservation, Service $service): RedirectResponse
    {
        // Get the pivot record to know how much to decrement
        $pivot = $reservation->services()->where('service_id', $service->id)->first()?->pivot;

        if ($pivot) {
            $reservation->decrement('total_amount', $pivot->unit_price * $pivot->quantity);
            $reservation->services()->detach($service->id);
            
            Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.reservations.serviceRemoved']);
        }

        return back();
    }
}
