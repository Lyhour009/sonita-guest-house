<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\WaitlistRoomAvailableMail;
use App\Models\WaitlistEntry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class WaitlistController extends Controller
{
    /**
     * Display every waitlist entry, most recent first.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        $entries = WaitlistEntry::query()
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query
                ->where(fn ($q) => $q->where('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/waitlist/index', [
            'entries' => $entries->through(fn (WaitlistEntry $entry) => [
                'id' => $entry->id,
                'email' => $entry->email,
                'phone_number' => $entry->phone_number,
                'stay_type' => $entry->stay_type,
                'from_date' => $entry->from_date?->toDateString(),
                'to_date' => $entry->to_date?->toDateString(),
                'notified_at' => $entry->notified_at?->toDateTimeString(),
                'created_at' => $entry->created_at?->toDateTimeString(),
            ]),
            'filters' => [
                'search' => $filters['search'] ?? null,
            ],
        ]);
    }

    /**
     * Email a waitlist entry that a room may now be available, and mark it notified.
     */
    public function notify(WaitlistEntry $entry): RedirectResponse
    {
        Mail::to($entry->email)->queue(new WaitlistRoomAvailableMail($entry));

        $entry->update(['notified_at' => now()]);

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.waitlist.notified']);

        return back();
    }
}
