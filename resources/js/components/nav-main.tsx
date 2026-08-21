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
        <SidebarGroup className="px-2.5 py-0.5">
            {label && (
                <SidebarGroupLabel className="px-3 pt-3.5 pb-1 text-[12px] font-bold uppercase tracking-wider text-muted-foreground/60 select-none">
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
                                    'group/btn relative flex h-10.5 w-full items-center gap-3 rounded-xl px-3.5 text-[15px] font-medium transition-all duration-150 ease-out',
                                    active
                                        ? 'bg-primary text-primary-foreground font-semibold shadow-2xs hover:bg-primary/95 hover:text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent/70 hover:text-foreground',
                                )}
                            >
                                <Link href={item.href} prefetch className="flex items-center gap-3">
                                    {item.icon && (
                                        <item.icon
                                            className={cn(
                                                'size-5 shrink-0 transition-transform duration-150 group-hover/btn:scale-105',
                                                active
                                                    ? 'text-primary-foreground'
                                                    : 'text-muted-foreground group-hover/btn:text-foreground',
                                            )}
                                        />
                                    )}
                                    <span className="truncate font-sans leading-relaxed tracking-normal">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
