<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceStoreRequest;
use App\Http\Requests\Admin\ServiceUpdateRequest;
use App\Models\ReservationService;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display the admin service listing.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'usage' => ['nullable', 'string', 'in:used,unused'],
        ]);

        $services = Service::query()
            ->withCount('reservationServices as usage_count')
            ->with('reservationServices')
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query->where('name', 'like', "%{$search}%"))
            ->when(($filters['usage'] ?? null) === 'used', fn ($query) => $query->has('reservationServices'))
            ->when(($filters['usage'] ?? null) === 'unused', fn ($query) => $query->doesntHave('reservationServices'))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total' => Service::count(),
            'totalBookings' => ReservationService::count(),
            'totalRevenue' => (float) DB::table('reservation_service')
                ->selectRaw('COALESCE(SUM(quantity * unit_price), 0) as total')
                ->value('total'),
            'unusedCount' => Service::doesntHave('reservationServices')->count(),
        ];

        return Inertia::render('admin/services/index', [
            'services' => $services->through(fn (Service $service) => [
                'id' => $service->id,
                'name' => $service->name,
                'price' => $service->price,
                'usage_count' => $service->usage_count,
                'revenue' => (float) $service->reservationServices->sum(
                    fn (ReservationService $reservationService) => $reservationService->quantity * $reservationService->unit_price,
                ),
            ]),
            'filters' => [
                'search' => $filters['search'] ?? null,
                'usage' => $filters['usage'] ?? null,
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created service.
     */
    public function store(ServiceStoreRequest $request): RedirectResponse
    {
        Service::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.services.created']);

        return to_route('admin.services.index');
    }

    /**
     * Update a service.
     */
    public function update(ServiceUpdateRequest $request, Service $service): RedirectResponse
    {
        $service->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.services.updated']);

        return to_route('admin.services.index');
    }

    /**
     * Delete a service.
     */
    public function destroy(Service $service): RedirectResponse
    {
        if ($service->reservationServices()->exists()) {
            Inertia::flash('toast', ['type' => 'error', 'key' => 'toasts.services.inUse']);

            return to_route('admin.services.index');
        }

        $service->delete();

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.services.deleted']);

        return to_route('admin.services.index');
    }
}
