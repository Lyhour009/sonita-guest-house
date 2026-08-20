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

        $revenueThisMonth = Payment::query()
            ->where('status', 'confirmed')
            ->whereBetween('paid_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->sum('amount');

        return Inertia::render('admin/dashboard/index', [
            'occupancy' => [
                'short_stay' => $shortStayOccupied,
                'long_stay' => $longStayOccupied,
                'total_rooms' => Room::query()->count(),
            ],
            'revenueThisMonth' => $revenueThisMonth,
            'outstandingInvoicesCount' => Invoice::query()->whereIn('status', ['unpaid', 'partial'])->count(),
            'openMaintenanceCount' => MaintenanceRequest::query()->whereIn('status', ['pending', 'in_progress'])->count(),
        ]);
    }
}
