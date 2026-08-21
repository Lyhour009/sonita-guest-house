<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\MaintenanceRequest;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Room;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        $shortStayOccupied = Reservation::query()
            ->where('reservation_type', 'short_stay')
            ->where('status', 'checked_in')
            ->count();

        $longStayOccupied = Reservation::query()
            ->where('reservation_type', 'long_stay')
            ->where('status', 'active')
            ->count();

        $totalRooms = Room::query()->count();

        $revenueThisMonth = (float) Payment::query()
            ->where('status', 'confirmed')
            ->whereBetween('paid_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->sum('amount');

        $roomStatusCounts = [
            'available' => Room::query()->where('status', 'available')->count(),
            'occupied' => Room::query()->where('status', 'occupied')->count(),
            'reserved' => Room::query()->where('status', 'reserved')->count(),
            'cleaning' => Room::query()->where('status', 'cleaning')->count(),
            'maintenance' => Room::query()->where('status', 'maintenance')->count(),
        ];

        $recentReservations = Reservation::query()
            ->with(['guest', 'room'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn (Reservation $r) => [
                'id' => $r->id,
                'guest_name' => $r->guest?->full_name ?? 'Guest',
                'room_number' => $r->room?->room_number ?? 'N/A',
                'room_type' => $r->room?->room_type ?? 'Standard',
                'reservation_type' => $r->reservation_type,
                'status' => $r->status,
                'check_in_date' => $r->check_in_date?->format('M d, Y') ?? $r->start_date?->format('M d, Y'),
                'check_out_date' => $r->check_out_date?->format('M d, Y') ?? $r->end_date?->format('M d, Y'),
            ])
            ->all();

        $recentPayments = Payment::query()
            ->with(['guest'])
            ->where('status', 'confirmed')
            ->latest('paid_at')
            ->take(5)
            ->get()
            ->map(fn (Payment $p) => [
                'id' => $p->id,
                'amount' => (float) $p->amount,
                'method' => $p->method ?? 'cash',
                'guest_name' => $p->guest?->full_name ?? 'Guest',
                'paid_at' => $p->paid_at?->diffForHumans() ?? 'Recently',
            ])
            ->all();

        return Inertia::render('admin/dashboard/index', [
            'occupancy' => [
                'short_stay' => $shortStayOccupied,
                'long_stay' => $longStayOccupied,
                'total_rooms' => $totalRooms,
            ],
            'revenueThisMonth' => $revenueThisMonth,
            'outstandingInvoicesCount' => Invoice::query()->whereIn('status', ['unpaid', 'partial'])->count(),
            'openMaintenanceCount' => MaintenanceRequest::query()->whereIn('status', ['pending', 'in_progress'])->count(),
            'roomStatusCounts' => $roomStatusCounts,
            'recentReservations' => $recentReservations,
            'recentPayments' => $recentPayments,
            'revenueTrend' => $this->revenueTrend(),
        ]);
    }

    /**
     * Confirmed payment revenue for each of the last 14 days, including days with no revenue.
     *
     * @return array<int, array{date: string, amount: float}>
     */
    private function revenueTrend(): array
    {
        $days = 14;

        $dailyTotals = Payment::query()
            ->selectRaw('DATE(paid_at) as date, SUM(amount) as total')
            ->where('status', 'confirmed')
            ->where('paid_at', '>=', now()->subDays($days - 1)->startOfDay())
            ->groupBy('date')
            ->pluck('total', 'date');

        return collect(range($days - 1, 0))
            ->map(function (int $daysAgo) use ($dailyTotals) {
                $date = now()->subDays($daysAgo)->toDateString();

                return [
                    'date' => $date,
                    'amount' => (float) ($dailyTotals[$date] ?? 0),
                ];
            })
            ->all();
    }
}
