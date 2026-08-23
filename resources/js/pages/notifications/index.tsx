import { Head, Link, router } from '@inertiajs/react';
import NotificationController from '@/actions/App/Http/Controllers/NotificationController';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { usePendingAction } from '@/hooks/use-pending-action';
import { useTranslation } from '@/hooks/use-translation';
import { resolveNotificationMessage } from '@/lib/notification-message';
import { cn } from '@/lib/utils';
import { index as notificationsIndex } from '@/routes/notifications';
import type { AppNotification, Paginated } from '@/types';

type Props = {
    notifications: Paginated<AppNotification>;
};

export default function NotificationsIndex({ notifications }: Props) {
    const { t } = useTranslation();
    const { isPending, withPending } = usePendingAction();

    const markRead = (id: string) => {
        router.patch(
            NotificationController.markRead.url(id),
            {},
            withPending(`read-${id}`, {
                preserveScroll: true,
                only: ['notifications', 'unreadNotificationsCount'],
            }),
        );
    };

    const markAllRead = () => {
        router.patch(
            NotificationController.markAllRead.url(),
            {},
            withPending('read-all', {
                preserveScroll: true,
                only: ['notifications', 'unreadNotificationsCount'],
            }),
        );
    };

    const hasUnread = notifications.data.some(
        (notification) => !notification.is_read,
    );

    return (
        <>
            <Head title={t('notifications.page.title')} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        {t('notifications.page.title')}
                    </h1>
                    {hasUnread && (
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending('read-all')}
                            onClick={markAllRead}
                        >
                            {isPending('read-all') && (
                                <Spinner className="mr-2" />
                            )}
                            {t('notifications.page.markAllRead')}
                        </Button>
                    )}
                </div>

                <div className="divide-y rounded-xl border">
                    {notifications.data.length === 0 && (
                        <p className="p-4 text-center text-muted-foreground">
                            {t('notifications.page.empty')}
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
                                        {t(
                                            `notifications.types.${notification.type}`,
                                        )}
                                    </Badge>
                                    {!notification.is_read && (
                                        <Badge variant="default">
                                            {t('notifications.page.newBadge')}
                                        </Badge>
                                    )}
                                </div>
                                {notification.link ? (
                                    <Link
                                        href={notification.link}
                                        className="block text-sm underline"
                                    >
                                        {resolveNotificationMessage(
                                            t,
                                            notification,
                                        )}
                                    </Link>
                                ) : (
                                    <p className="text-sm">
                                        {resolveNotificationMessage(
                                            t,
                                            notification,
                                        )}
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
                                    disabled={isPending(
                                        `read-${notification.id}`,
                                    )}
                                    onClick={() => markRead(notification.id)}
                                >
                                    {isPending(`read-${notification.id}`) && (
                                        <Spinner className="mr-2" />
                                    )}
                                    {t('notifications.page.markRead')}
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
