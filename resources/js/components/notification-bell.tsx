import { Link, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { index as notificationsIndex } from '@/routes/notifications';

export function NotificationBell() {
    const { unreadNotificationsCount } = usePage().props;
    const { t } = useTranslation();

    return (
        <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href={notificationsIndex()}>
                <Bell />
                {unreadNotificationsCount > 0 && (
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]"
                    >
                        {unreadNotificationsCount > 9
                            ? '9+'
                            : unreadNotificationsCount}
                    </Badge>
                )}
                <span className="sr-only">
                    {t('notifications.bell.srLabel')}
                </span>
            </Link>
        </Button>
    );
}
