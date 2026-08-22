<?php

namespace App\Http\Controllers\Staff;

use App\Actions\Reservations\CancelReservation;
use App\Actions\Reservations\CheckInReservation;
use App\Actions\Reservations\CheckOutReservation;
use App\Actions\Reservations\ConfirmReservation;
use App\Actions\Reservations\CreateWalkInReservation;
use App\Actions\Reservations\ReservationIndexData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\ReservationStoreRequest;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    /**
     * Display every reservation for front-desk oversight.
     */
    public function index(Request $request, ReservationIndexData $data): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:pending,confirmed,checked_in,checked_out,active,expired,cancelled,terminated'],
        ]);

        return Inertia::render('staff/reservations/index', $data->handle($filters));
    }

    /**
     * Create a walk-in booking.
     */
    public function store(ReservationStoreRequest $request, CreateWalkInReservation $action): RedirectResponse
    {
        $action->handle($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.reservations.createdByStaff']);

        return back();
    }

    /**
     * Confirm a pending reservation.
     */
    public function confirm(Reservation $reservation, ConfirmReservation $action): RedirectResponse
    {
        $action->handle($reservation);

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.reservations.confirmed']);

        return back();
    }

    /**
     * Check-in a guest into their assigned room.
     */
    public function checkIn(Request $request, Reservation $reservation, CheckInReservation $action): RedirectResponse
    {
        $action->handle($reservation);

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.reservations.checkedIn']);

        return back();
    }

    /**
     * Check out a guest and transition room to dirty housekeeping.
     */
    public function checkOut(Reservation $reservation, CheckOutReservation $action): RedirectResponse
    {
        $updatedReservation = $action->handle($reservation);

        $updatedReservation->load(['invoices' => fn ($q) => $q->latest(), 'guest', 'room']);
        $invoice = $updatedReservation->invoices->first();

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.reservations.checkedOut']);

        if ($invoice) {
            Inertia::flash('checkoutInvoice', [
                'id' => $invoice->id,
                'room_number' => $updatedReservation->room->room_number,
                'guest_name' => $updatedReservation->guest?->full_name ?? 'Guest',
                'room_charge' => (float) $invoice->room_charge,
                'service_charge' => (float) $invoice->service_charge,
                'tax_amount' => (float) $invoice->tax_amount,
                'total_amount' => (float) $invoice->total_amount,
                'due_date' => $invoice->due_date?->toDateString(),
            ]);
        }

        return back();
    }

    /**
     * Cancel an active or pending reservation.
     */
    public function cancel(Reservation $reservation, CancelReservation $action): RedirectResponse
    {
        $action->handle($reservation);

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.reservations.cancelled']);

        return back();
    }
}
