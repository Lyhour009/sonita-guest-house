import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <div className="flex w-full items-center gap-3">
            <div className="relative flex aspect-square size-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background shadow-xs transition-transform duration-200 group-hover/logo:scale-105">
                <AppLogoIcon className="size-5.5 fill-current" />
            </div>
            <div className="grid min-w-0 flex-1 text-left">
                <span className="truncate font-sans text-[15px] font-bold tracking-tight text-foreground">
                    {name || 'Hour Guest House'}
                </span>
                <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <span className="truncate text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Guest House PMS
                    </span>
                </div>
            </div>
        </div>
    );
}
