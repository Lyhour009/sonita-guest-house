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
        <Button
            variant="outline"
            size="icon"
            className="group relative h-9 w-9 rounded-lg border-sidebar-border/80 bg-background/80 shadow-2xs backdrop-blur-xs transition-all duration-200 hover:border-sidebar-border hover:bg-accent hover:text-accent-foreground active:scale-95"
            asChild
        >
            <Link href={notificationsIndex()}>
                <Bell className="size-4 text-muted-foreground transition-transform duration-200 group-hover:scale-110 group-hover:text-foreground" />
                {unreadNotificationsCount > 0 && (
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-xs animate-in zoom-in-50 duration-200"
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
