<?php

namespace App\Http\Controllers\Staff;

use App\Actions\Reservations\CancelReservation;
use App\Actions\Reservations\CheckInReservation;
use App\Actions\Reservations\CheckOutReservation;
use App\Actions\Reservations\ConfirmReservation;
use App\Actions\Reservations\CreateWalkInReservation;
use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\ReservationStoreRequest;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    /**
     * Display every reservation for front-desk oversight.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:pending,confirmed,checked_in,checked_out,active,expired,cancelled,terminated'],
        ]);

        $reservations = Reservation::query()
            ->with([
                'guest:id,full_name,email,phone_number',
                'room:id,room_number,room_type,price_per_night,price_per_month',
                'invoices' => fn ($q) => $q->latest(),
                'services:id,name,price',
            ])
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query->where(
                fn ($query) => $query
                    ->whereHas('guest', fn ($guest) => $guest->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone_number', 'like', "%{$search}%"))
                    ->orWhereHas('room', fn ($room) => $room->where('room_number', 'like', "%{$search}%")),
            ))
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Optimized single-query status aggregate count
        $counts = Reservation::query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $statusCounts = [
            'all' => (int) $counts->sum(),
            'pending' => (int) $counts->get('pending', 0),
            'confirmed' => (int) $counts->get('confirmed', 0),
            'checked_in' => (int) $counts->get('checked_in', 0),
            'active' => (int) $counts->get('active', 0),
            'checked_out' => (int) $counts->get('checked_out', 0),
            'cancelled' => (int) $counts->get('cancelled', 0),
        ];

        // Optimized Timeline query (single eager-loaded query to eliminate N+1)
        $timelineStartDate = now()->subDays(1)->startOfDay()->toDateString();
        $timelineEndDate = now()->addDays(14)->endOfDay()->toDateString();

        $rooms = Room::query()
            ->orderBy('room_number')
            ->get(['id', 'room_number', 'room_type', 'status', 'rental_mode', 'max_occupants']);

        $timelineReservations = Reservation::query()
            ->whereIn('status', ['confirmed', 'checked_in', 'active', 'pending'])
            ->where(function ($query) use ($timelineStartDate, $timelineEndDate) {
                $query->where(function ($q) use ($timelineStartDate, $timelineEndDate) {
                    $q->where('reservation_type', 'short_stay')
                        ->where('check_in_date', '<=', $timelineEndDate)
                        ->where('check_out_date', '>=', $timelineStartDate);
                })->orWhere(function ($q) use ($timelineStartDate, $timelineEndDate) {
                    $q->where('reservation_type', 'long_stay')
                        ->where('start_date', '<=', $timelineEndDate)
                        ->where(fn ($sub) => $sub->whereNull('end_date')->orWhere('end_date', '>=', $timelineStartDate));
                });
            })
            ->with('guest:id,full_name')
            ->get(['id', 'room_id', 'guest_id', 'reservation_type', 'status', 'check_in_date', 'check_out_date', 'start_date', 'end_date'])
            ->groupBy('room_id');

        $timelineRooms = $rooms->map(function (Room $room) use ($timelineReservations, $timelineEndDate) {
            $bookings = ($timelineReservations->get($room->id) ?? collect())->map(fn (Reservation $res) => [
                'id' => $res->id,
                'guest_name' => $res->guest?->full_name ?? 'Guest',
                'reservation_type' => $res->reservation_type,
                'status' => $res->status,
                'start_date' => $res->reservation_type === 'short_stay'
                    ? $res->check_in_date?->toDateString()
                    : $res->start_date?->toDateString(),
                'end_date' => $res->reservation_type === 'short_stay'
                    ? $res->check_out_date?->toDateString()
                    : ($res->end_date?->toDateString() ?? $timelineEndDate),
            ]);

            return [
                'id' => $room->id,
                'room_number' => $room->room_number,
                'room_type' => $room->room_type,
                'status' => $room->status,
                'bookings' => $bookings,
            ];
        });

        return Inertia::render('staff/reservations/index', [
            'reservations' => $reservations->through(function (Reservation $reservation) {
                $latestInvoice = $reservation->invoices->first();

                return [
                    'id' => $reservation->id,
                    'reservation_type' => $reservation->reservation_type,
                    'check_in_date' => $reservation->check_in_date?->toDateString(),
                    'check_out_date' => $reservation->check_out_date?->toDateString(),
                    'start_date' => $reservation->start_date?->toDateString(),
                    'end_date' => $reservation->end_date?->toDateString(),
                    'deposit_amount' => $reservation->deposit_amount ? (float) $reservation->deposit_amount : null,
                    'monthly_due_day' => $reservation->monthly_due_day,
                    'num_guests' => $reservation->num_guests ?? 1,
                    'created_at' => $reservation->created_at?->format('M d, Y H:i'),
                    'status' => $reservation->status,
                    'guest' => [
                        'id' => $reservation->guest?->id,
                        'full_name' => $reservation->guest?->full_name ?? 'Guest',
                        'email' => $reservation->guest?->email ?? '',
                        'phone_number' => $reservation->guest?->phone_number,
                    ],
                    'room' => [
                        'id' => $reservation->room->id,
                        'room_number' => $reservation->room->room_number,
                        'room_type' => $reservation->room->room_type,
                        'price_per_night' => (float) $reservation->room->price_per_night,
                        'price_per_month' => (float) $reservation->room->price_per_month,
                    ],
                    'latest_invoice' => $latestInvoice ? [
                        'id' => $latestInvoice->id,
                        'total_amount' => (float) $latestInvoice->total_amount,
                        'status' => $latestInvoice->status,
                        'due_date' => $latestInvoice->due_date?->toDateString(),
                    ] : null,
                    'services' => $reservation->services->map(fn ($s) => [
                        'id' => $s->id,
                        'name' => $s->name,
                        'price' => (float) $s->price,
                        'quantity' => (int) $s->pivot->quantity,
                    ]),
                ];
            }),
            'filters' => [
                'search' => $filters['search'] ?? null,
                'status' => $filters['status'] ?? null,
            ],
            'statusCounts' => $statusCounts,
            'timelineRooms' => $timelineRooms,
            'guests' => User::query()
                ->where('role', 'guest')
                ->orderBy('full_name')
                ->get(['id', 'full_name', 'email', 'phone_number']),
            'rooms' => $rooms->filter(fn (Room $r) => $r->status !== 'maintenance')->values(),
        ]);
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
        $action->handle($reservation);

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.reservations.checkedOut']);

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
