import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <div className="flex items-center gap-3 w-full">
            <div className="relative flex aspect-square size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white shadow-xs ring-1 ring-black/5 transition-all duration-300 group-hover:scale-105 dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-300 dark:text-neutral-900 dark:ring-white/10">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="grid flex-1 text-left min-w-0">
                <span className="truncate text-sm font-bold tracking-tight text-sidebar-foreground">
                    {name || 'Hour Guest House'}
                </span>
                <span className="truncate text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                    Guest House PMS
                </span>
            </div>
        </div>
    );
}
