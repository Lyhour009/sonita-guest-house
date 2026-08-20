<?php

namespace App\Http\Controllers;

use App\Actions\Maintenance\SubmitMaintenanceRequest;
use App\Http\Requests\MaintenanceRequestStoreRequest;
use App\Models\MaintenanceRequest;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceRequestController extends Controller
{
    /**
     * Display the authenticated guest's own maintenance requests.
     */
    public function index(Request $request): Response
    {
        $requests = $request->user()
            ->maintenanceRequests()
            ->with('room')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('maintenance/index', [
            'requests' => $requests->through(fn (MaintenanceRequest $maintenanceRequest) => [
                'id' => $maintenanceRequest->id,
                'title' => $maintenanceRequest->title,
                'description' => $maintenanceRequest->description,
                'priority' => $maintenanceRequest->priority,
                'status' => $maintenanceRequest->status,
                'created_at' => $maintenanceRequest->created_at?->toDateString(),
                'room' => [
                    'id' => $maintenanceRequest->room->id,
                    'room_number' => $maintenanceRequest->room->room_number,
                ],
            ]),
            'rooms' => Room::query()
                ->whereHas('reservations', fn ($query) => $query->where('guest_id', $request->user()->id))
                ->orderBy('room_number')
                ->get(['id', 'room_number'])
                ->unique('id')
                ->values(),
        ]);
    }

    /**
     * Submit a maintenance request (guest or staff).
     */
    public function store(MaintenanceRequestStoreRequest $request, SubmitMaintenanceRequest $action): RedirectResponse
    {
        $action->handle($request->user(), [
            'room_id' => $request->validated('room_id'),
            'title' => $request->validated('title'),
            'description' => $request->validated('description'),
            'priority' => $request->validated('priority'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Maintenance request submitted.')]);

        return back();
    }
}
