import { Head, Link, router } from '@inertiajs/react';
import NotificationController from '@/actions/App/Http/Controllers/NotificationController';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { index as notificationsIndex } from '@/routes/notifications';
import type { AppNotification, Paginated } from '@/types';

type Props = {
    notifications: Paginated<AppNotification>;
};

export default function NotificationsIndex({ notifications }: Props) {
    const markRead = (id: string) => {
        router.patch(
            NotificationController.markRead.url(id),
            {},
            {
                preserveScroll: true,
                only: ['notifications', 'unreadNotificationsCount'],
            },
        );
    };

    const markAllRead = () => {
        router.patch(
            NotificationController.markAllRead.url(),
            {},
            {
                preserveScroll: true,
                only: ['notifications', 'unreadNotificationsCount'],
            },
        );
    };

    const hasUnread = notifications.data.some(
        (notification) => !notification.is_read,
    );

    return (
        <>
            <Head title="Notifications" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Notifications</h1>
                    {hasUnread && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={markAllRead}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>

                <div className="divide-y rounded-xl border">
                    {notifications.data.length === 0 && (
                        <p className="p-4 text-center text-muted-foreground">
                            You have no notifications yet.
                        </p>
                    )}
                    {notifications.data.map((notification) => (
                        <div
                            key={notification.id}
                            className={cn(
                                'flex items-center justify-between gap-4 p-4',
                                !notification.is_read && 'bg-muted/50',
                            )}
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">
                                        {notification.type.replaceAll('_', ' ')}
                                    </Badge>
                                    {!notification.is_read && (
                                        <Badge variant="default">New</Badge>
                                    )}
                                </div>
                                {notification.link ? (
                                    <Link
                                        href={notification.link}
                                        className="block text-sm underline"
                                    >
                                        {notification.message}
                                    </Link>
                                ) : (
                                    <p className="text-sm">
                                        {notification.message}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    {notification.created_at}
                                </p>
                            </div>
                            {!notification.is_read && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => markRead(notification.id)}
                                >
                                    Mark read
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <Pagination meta={notifications} />
            </div>
        </>
    );
}

NotificationsIndex.layout = {
    breadcrumbs: [{ title: 'Notifications', href: notificationsIndex() }],
};
