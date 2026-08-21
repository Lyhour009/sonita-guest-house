<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceStoreRequest;
use App\Http\Requests\Admin\ServiceUpdateRequest;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display the admin service listing.
     */
    public function index(): Response
    {
        $services = Service::query()
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/services/index', [
            'services' => $services->through(fn (Service $service) => [
                'id' => $service->id,
                'name' => $service->name,
                'price' => $service->price,
            ]),
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
        $service->delete();

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.services.deleted']);

        return to_route('admin.services.index');
    }
}
