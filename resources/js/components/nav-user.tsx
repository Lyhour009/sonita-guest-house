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
                    className="group relative flex h-11 w-full items-center gap-3.5 rounded-xl border border-sidebar-border/60 bg-sidebar-accent/20 px-3.5 text-[14.5px] font-medium text-muted-foreground shadow-2xs transition-all duration-200 hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive active:scale-[0.98] dark:hover:bg-destructive/20"
                    data-test="sidebar-logout-button"
                >
                    <Link
                        href={logout()}
                        as="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3.5 cursor-pointer"
                        data-test="logout-button"
                    >
                        <LogOut className="size-5 shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-x-0.5 text-muted-foreground group-hover:text-destructive" />
                        <span className="truncate font-sans font-medium text-left">
                            {t('nav.logout')}
                        </span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
