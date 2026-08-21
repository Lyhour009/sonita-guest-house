import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

export function NavMain({
    items = [],
    label,
}: {
    items: NavItem[];
    label?: string;
}) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2.5 py-1">
            {label && (
                <SidebarGroupLabel className="px-3 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 select-none">
                    {label}
                </SidebarGroupLabel>
            )}
            <SidebarMenu className="gap-1">
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className={cn(
                                    'group/btn relative flex h-9.5 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-200 ease-out',
                                    active
                                        ? 'bg-primary/10 font-semibold text-primary shadow-2xs dark:bg-primary/20 dark:text-primary-foreground'
                                        : 'text-sidebar-foreground/75 hover:translate-x-0.5 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground',
                                )}
                            >
                                <Link href={item.href} prefetch className="flex items-center gap-3">
                                    {item.icon && (
                                        <item.icon
                                            className={cn(
                                                'size-4.5 shrink-0 transition-transform duration-200 group-hover/btn:scale-110',
                                                active
                                                    ? 'text-primary dark:text-primary-foreground'
                                                    : 'text-sidebar-foreground/70 group-hover/btn:text-sidebar-foreground',
                                            )}
                                        />
                                    )}
                                    <span className="truncate font-sans leading-relaxed">{item.title}</span>
                                    {active && (
                                        <span className="ml-auto size-1.5 rounded-full bg-primary animate-in fade-in-0 zoom-in-50 duration-200" />
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
