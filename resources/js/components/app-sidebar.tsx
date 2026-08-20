import { Link, usePage } from '@inertiajs/react';
import {
    BedDouble,
    BookOpen,
    CalendarCheck,
    ClipboardList,
    CreditCard,
    FileText,
    FolderGit2,
    LayoutGrid,
    Wrench,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as adminInvoicesIndex } from '@/routes/admin/invoices';
import { index as adminRoomsIndex } from '@/routes/admin/rooms';
import { index as invoicesIndex } from '@/routes/invoices';
import { index as maintenanceIndex } from '@/routes/maintenance';
import { index as paymentsIndex } from '@/routes/payments';
import { index as reservationsIndex } from '@/routes/reservations';
import { index as staffHousekeepingIndex } from '@/routes/staff/housekeeping';
import { index as staffMaintenanceIndex } from '@/routes/staff/maintenance';
import { index as staffPaymentsIndex } from '@/routes/staff/payments';
import { index as staffReservationsIndex } from '@/routes/staff/reservations';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const guestNavItems: NavItem[] = [
    {
        title: 'My Reservations',
        href: reservationsIndex(),
        icon: CalendarCheck,
    },
    {
        title: 'My Invoices',
        href: invoicesIndex(),
        icon: FileText,
    },
    {
        title: 'My Payments',
        href: paymentsIndex(),
        icon: CreditCard,
    },
    {
        title: 'Maintenance',
        href: maintenanceIndex(),
        icon: Wrench,
    },
];

const staffNavItems: NavItem[] = [
    {
        title: 'Reservations',
        href: staffReservationsIndex(),
        icon: CalendarCheck,
    },
    {
        title: 'Payments',
        href: staffPaymentsIndex(),
        icon: CreditCard,
    },
];

const housekeepingNavItems: NavItem[] = [
    {
        title: 'Room Status',
        href: staffHousekeepingIndex(),
        icon: ClipboardList,
    },
    {
        title: 'Maintenance',
        href: staffMaintenanceIndex(),
        icon: Wrench,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Rooms',
        href: adminRoomsIndex(),
        icon: BedDouble,
    },
    {
        title: 'Invoices',
        href: adminInvoicesIndex(),
        icon: FileText,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {auth.user?.role === 'guest' && (
                    <NavMain items={guestNavItems} label="Reservations" />
                )}
                {(auth.user?.role === 'receptionist' ||
                    auth.user?.role === 'admin') && (
                    <NavMain items={staffNavItems} label="Staff" />
                )}
                {(auth.user?.role === 'housekeeping' ||
                    auth.user?.role === 'admin') && (
                    <NavMain
                        items={housekeepingNavItems}
                        label="Housekeeping"
                    />
                )}
                {auth.user?.role === 'admin' && (
                    <NavMain items={adminNavItems} label="Admin" />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
