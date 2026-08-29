import { Link, router, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useTranslation } from '@/hooks/use-translation';
import { logout } from '@/routes';

export function NavUser() {
    const { auth } = usePage().props;
    const cleanup = useMobileNavigation();
    const { t } = useTranslation();

    if (!auth.user) {
        return null;
    }

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    size="lg"
                    tooltip={{ children: t('nav.logout') }}
                    className="group relative flex h-11 w-full items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-3.5 text-[15px] font-medium text-muted-foreground transition-all duration-200 hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive active:scale-[0.98]"
                    data-test="sidebar-logout-button"
                >
                    <Link
                        href={logout()}
                        as="button"
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center gap-3"
                        data-test="logout-button"
                    >
                        <LogOut className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:scale-110 group-hover:text-destructive" />
                        <span className="truncate text-left font-sans font-medium">
                            {t('nav.logout')}
                        </span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
