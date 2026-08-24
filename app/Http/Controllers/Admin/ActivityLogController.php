<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    /**
     * Display the audit trail of sensitive admin/staff actions.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'action' => ['nullable', 'string', 'max:255'],
        ]);

        $logs = ActivityLog::query()
            ->with('causer:id,full_name')
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query->where('description', 'like', "%{$search}%"))
            ->when($filters['action'] ?? null, fn ($query, string $action) => $query->where('action', $action))
            ->latest('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/activity-log/index', [
            'logs' => $logs->through(fn (ActivityLog $log) => [
                'id' => $log->id,
                'causer_name' => $log->causer?->full_name ?? 'System',
                'action' => $log->action,
                'description' => $log->description,
                'created_at' => $log->created_at?->toDateTimeString(),
            ]),
            'filters' => [
                'search' => $filters['search'] ?? null,
                'action' => $filters['action'] ?? null,
            ],
            'actionOptions' => ActivityLog::query()->distinct()->orderBy('action')->pluck('action'),
        ]);
    }
}
