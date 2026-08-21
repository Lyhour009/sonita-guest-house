<?php

namespace App\Actions\Notifications;

use App\Mail\UserNotificationMail;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class NotifyUser
{
    public function handle(User $user, string $type, string $message, ?string $link = null): Notification
    {
        $notification = $user->notifications()->create([
            'type' => $type,
            'message' => $message,
            'link' => $link,
            'is_read' => false,
        ]);

        Mail::to($user)->queue(new UserNotificationMail($type, $message, $link));

        return $notification;
    }
}
