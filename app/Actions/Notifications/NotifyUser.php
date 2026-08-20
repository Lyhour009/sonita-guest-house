<?php

namespace App\Actions\Notifications;

use App\Models\Notification;
use App\Models\User;

class NotifyUser
{
    public function handle(User $user, string $type, string $message, ?string $link = null): Notification
    {
        return $user->notifications()->create([
            'type' => $type,
            'message' => $message,
            'link' => $link,
            'is_read' => false,
        ]);
    }
}
