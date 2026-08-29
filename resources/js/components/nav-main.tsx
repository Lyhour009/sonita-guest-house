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

    const menu = (
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
                                // !-forced: the base variant's own
                                // data-[active=true]:bg-sidebar-accent has equal specificity
                                // and isn't guaranteed to lose the cascade on class order alone,
                                // so this must win via !important rather than specificity/order.
                                'group/btn relative flex h-10.5 w-full items-center gap-3 rounded-xl px-3.5 text-[15px] font-medium text-muted-foreground transition-all duration-150 ease-out hover:bg-accent/70 hover:text-foreground',
                                'data-[active=true]:bg-primary! data-[active=true]:font-semibold! data-[active=true]:text-primary-foreground! data-[active=true]:shadow-2xs! data-[active=true]:hover:bg-primary/95! data-[active=true]:hover:text-primary-foreground!',
                            )}
                        >
                            <Link
                                href={item.href}
                                prefetch
                                className="flex items-center gap-3"
                            >
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
    );

    if (!label) {
        return <SidebarGroup className="px-2.5 py-0.5">{menu}</SidebarGroup>;
    }

    return (
        <SidebarGroup className="px-2.5 py-0.5">
            <SidebarGroupLabel className="px-3 pt-3.5 pb-1 text-[12px] font-bold tracking-wider text-muted-foreground/60 uppercase select-none">
                {label}
            </SidebarGroupLabel>
            {menu}
        </SidebarGroup>
    );
}
