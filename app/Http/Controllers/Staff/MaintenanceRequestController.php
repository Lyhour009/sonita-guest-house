<?php

namespace App\Http\Controllers\Staff;

use App\Actions\Maintenance\AssignMaintenanceRequest;
use App\Actions\Maintenance\UpdateMaintenanceRequestStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\MaintenanceAssignRequest;
use App\Http\Requests\Staff\MaintenanceStatusUpdateRequest;
use App\Models\MaintenanceRequest;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceRequestController extends Controller
{
    /**
     * Display maintenance requests — every request for admin, only assigned ones for housekeeping.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:pending,in_progress,resolved,cancelled'],
            'priority' => ['nullable', 'string', 'in:low,medium,high'],
        ]);

        $isAdmin = $request->user()->role === 'admin';

        $requests = MaintenanceRequest::query()
            ->with(['room', 'reporter', 'assignee'])
            ->when(! $isAdmin, fn ($query) => $query->where('assigned_to', $request->user()->id))
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query->where(
                fn ($query) => $query
                    ->where('title', 'like', "%{$search}%")
                    ->orWhereHas('room', fn ($room) => $room->where('room_number', 'like', "%{$search}%")),
            ))
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when($filters['priority'] ?? null, fn ($query, string $priority) => $query->where('priority', $priority))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('staff/maintenance/index', [
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
                'reporter' => [
                    'full_name' => $maintenanceRequest->reporter->full_name,
                ],
                'assignee' => $maintenanceRequest->assignee ? [
                    'id' => $maintenanceRequest->assignee->id,
                    'full_name' => $maintenanceRequest->assignee->full_name,
                ] : null,
            ]),
            'filters' => [
                'search' => $filters['search'] ?? null,
                'status' => $filters['status'] ?? null,
                'priority' => $filters['priority'] ?? null,
            ],
            'isAdmin' => $isAdmin,
            'housekeepingStaff' => $isAdmin
                ? User::query()->where('role', 'housekeeping')->orderBy('full_name')->get(['id', 'full_name'])
                : [],
            'rooms' => Room::query()->orderBy('room_number')->get(['id', 'room_number']),
        ]);
    }

    /**
     * Assign a maintenance request to a housekeeping staff member.
     */
    public function assign(MaintenanceRequest $maintenanceRequest, MaintenanceAssignRequest $request, AssignMaintenanceRequest $action): RedirectResponse
    {
        abort_unless($request->user()->role === 'admin', 403);

        $assignee = User::findOrFail((string) $request->validated('assigned_to'));

        $action->handle($maintenanceRequest, $assignee);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Maintenance request assigned.')]);

        return back();
    }

    /**
     * Update a maintenance request's status.
     */
    public function updateStatus(MaintenanceRequest $maintenanceRequest, MaintenanceStatusUpdateRequest $request, UpdateMaintenanceRequestStatus $action): RedirectResponse
    {
        $action->handle($maintenanceRequest, (string) $request->validated('status'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Maintenance request updated.')]);

        return back();
    }
}
