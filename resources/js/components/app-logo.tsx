import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <div className="flex items-center gap-3 w-full">
            <div className="relative flex aspect-square size-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background shadow-xs transition-transform duration-200 group-hover/logo:scale-105">
                <AppLogoIcon className="size-5.5 fill-current" />
            </div>
            <div className="grid flex-1 text-left min-w-0">
                <span className="truncate text-[15px] font-bold tracking-tight text-foreground font-sans">
                    {name || 'Hour Guest House'}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <span className="truncate text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Guest House PMS
                    </span>
                </div>
            </div>
        </div>
    );
}
