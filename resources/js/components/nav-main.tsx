import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useNavGroupState } from '@/hooks/use-nav-group-state';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

export function NavMain({
    items = [],
    label,
    id,
    defaultOpen = true,
}: {
    items: NavItem[];
    label?: string;
    id?: string;
    defaultOpen?: boolean;
}) {
    const { isCurrentUrl } = useCurrentUrl();
    const { state, isMobile } = useSidebar();
    const [storedOpen, setOpen] = useNavGroupState(id, defaultOpen);
    // The group's label/chevron — the only way to toggle it — is hidden
    // whenever the sidebar itself is collapsed to an icon-only rail, so a
    // group the user previously closed must still show its icons there.
    const isIconRail = !isMobile && state === 'collapsed';
    const open = isIconRail ? true : storedOpen;

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
        <Collapsible
            open={open}
            onOpenChange={setOpen}
            className="group/collapsible px-2.5 py-0.5"
        >
            <SidebarGroup className="p-0">
                <CollapsibleTrigger asChild>
                    <SidebarGroupLabel className="cursor-pointer px-3 pt-3.5 pb-1 text-[12px] font-bold tracking-wider text-muted-foreground/60 uppercase select-none hover:text-muted-foreground">
                        {label}
                        <ChevronRight className="ml-auto size-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent
                    className={cn(
                        'overflow-hidden',
                        // Skip the animation when the icon rail is forcing this
                        // group open — otherwise every group that was collapsed
                        // plays an "opening" transition on rail toggle, while
                        // already-open groups don't, making the toggle look
                        // inconsistent from group to group.
                        !isIconRail &&
                            'data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down',
                    )}
                >
                    {menu}
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}
