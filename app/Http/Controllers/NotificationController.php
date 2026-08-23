<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Display the authenticated user's notifications.
     */
    public function index(Request $request): Response
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('notifications/index', [
            'notifications' => $notifications->through(fn (Notification $notification) => [
                'id' => $notification->id,
                'type' => $notification->type,
                'message' => $notification->message,
                'data' => $notification->data ?? [],
                'link' => $notification->link,
                'is_read' => $notification->is_read,
                'created_at' => $notification->created_at?->toDateTimeString(),
            ]),
        ]);
    }

    /**
     * Mark a single notification as read.
     */
    public function markRead(Request $request, Notification $notification): RedirectResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403);

        $notification->update(['is_read' => true]);

        return back();
    }

    /**
     * Mark every unread notification for the authenticated user as read.
     */
    public function markAllRead(Request $request): RedirectResponse
    {
        $request->user()->notifications()->where('is_read', false)->update(['is_read' => true]);

        return back();
    }
}
