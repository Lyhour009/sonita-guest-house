<?php

namespace App\Http\Controllers;

use App\Http\Requests\WaitlistStoreRequest;
use App\Models\WaitlistEntry;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class WaitlistController extends Controller
{
    /**
     * Capture a guest's contact details for a fully-booked date search.
     */
    public function store(WaitlistStoreRequest $request): RedirectResponse
    {
        WaitlistEntry::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.waitlist.joined']);

        return back();
    }
}
