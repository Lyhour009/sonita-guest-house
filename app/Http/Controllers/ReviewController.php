<?php

namespace App\Http\Controllers;

use App\Actions\Reviews\CreateReview;
use App\Http\Requests\ReviewStoreRequest;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Record a guest's review of one of their own completed short stays.
     */
    public function store(ReviewStoreRequest $request, Reservation $reservation, CreateReview $action): RedirectResponse
    {
        abort_unless($reservation->guest_id === $request->user()->id, 403);
        abort_unless($reservation->status === 'checked_out', 422);
        abort_if($reservation->review()->exists(), 422);

        $action->handle($reservation, $request->user(), $request->validated()['rating'], $request->validated()['comment'] ?? null);

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.reviews.created']);

        return back();
    }
}
