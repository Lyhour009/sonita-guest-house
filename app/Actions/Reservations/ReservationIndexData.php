<?php

namespace App\Actions\Reservations;

use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Service;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ReservationIndexData
{
    /**
     * @param  array{search?: string|null, status?: string|null}  $filters
     * @return array<string, mixed>
     */
    public function handle(array $filters): array
    {
        $reservations = $this->queryReservations($filters);
        $statusCounts = $this->statusCounts();
        $rooms = $this->rooms();
        $timelineRooms = $this->timelineRooms($rooms);

        return [
            'reservations' => ReservationResource::collection($reservations),
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
            'available_services' => Service::query()->orderBy('name')->get(['id', 'name', 'price']),
        ];
    }

    /**
     * @param  array{search?: string|null, status?: string|null}  $filters
     * @return LengthAwarePaginator<Reservation>
     */
    private function queryReservations(array $filters): LengthAwarePaginator
    {
        return Reservation::query()
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
    }

    /**
     * @return array<string, int>
     */
    private function statusCounts(): array
    {
        $counts = Reservation::query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return [
            'all' => (int) $counts->sum(),
            'pending' => (int) $counts->get('pending', 0),
            'confirmed' => (int) $counts->get('confirmed', 0),
            'checked_in' => (int) $counts->get('checked_in', 0),
            'active' => (int) $counts->get('active', 0),
            'checked_out' => (int) $counts->get('checked_out', 0),
            'cancelled' => (int) $counts->get('cancelled', 0),
        ];
    }

    /**
     * @return Collection<int, Room>
     */
    private function rooms(): Collection
    {
        return Room::query()
            ->orderBy('room_number')
            ->get(['id', 'room_number', 'room_type', 'status', 'rental_mode', 'max_occupants']);
    }

    /**
     * @param  Collection<int, Room>  $rooms
     * @return Collection<int, array<string, mixed>>
     */
    private function timelineRooms(Collection $rooms): Collection
    {
        $timelineStartDate = now()->subDays(1)->startOfDay()->toDateString();
        $timelineEndDate = now()->addDays(14)->endOfDay()->toDateString();

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

        return $rooms->map(function (Room $room) use ($timelineReservations, $timelineEndDate) {
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
    }

}
