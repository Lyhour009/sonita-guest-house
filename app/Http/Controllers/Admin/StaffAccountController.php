<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Staff\CreateStaffAccount;
use App\Actions\Staff\UpdateStaffAccount;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StaffAccountStoreRequest;
use App\Http\Requests\Admin\StaffAccountUpdateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StaffAccountController extends Controller
{
    /**
     * Display the admin staff listing.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'in:receptionist,housekeeping'],
        ]);

        $staff = User::query()
            ->whereIn('role', ['receptionist', 'housekeeping'])
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query->where(
                fn ($query) => $query->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%"),
            ))
            ->when($filters['role'] ?? null, fn ($query, string $role) => $query->where('role', $role))
            ->orderBy('full_name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/staff/index', [
            'staff' => $staff->through(fn (User $user) => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'role' => $user->role,
            ]),
            'filters' => [
                'search' => $filters['search'] ?? null,
                'role' => $filters['role'] ?? null,
            ],
        ]);
    }

    /**
     * Store a newly created staff account.
     */
    public function store(StaffAccountStoreRequest $request, CreateStaffAccount $action): RedirectResponse
    {
        $action->handle([
            'full_name' => $request->validated('full_name'),
            'email' => $request->validated('email'),
            'phone_number' => $request->validated('phone_number'),
            'role' => $request->validated('role'),
            'password' => $request->validated('password'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.staffAccounts.created']);

        return to_route('admin.staff.index');
    }

    /**
     * Update a staff account.
     */
    public function update(StaffAccountUpdateRequest $request, User $staff, UpdateStaffAccount $action): RedirectResponse
    {
        $action->handle($staff, [
            'full_name' => $request->validated('full_name'),
            'email' => $request->validated('email'),
            'phone_number' => $request->validated('phone_number'),
            'role' => $request->validated('role'),
            'password' => $request->validated('password'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.staffAccounts.updated']);

        return to_route('admin.staff.index');
    }
}
