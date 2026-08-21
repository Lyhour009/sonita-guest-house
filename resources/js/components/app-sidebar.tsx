import { Link, usePage } from '@inertiajs/react';
import {
    BedDouble,
    CalendarCheck,
    ClipboardList,
    ConciergeBell,
    CreditCard,
    FileText,
    LayoutGrid,
    Settings,
    Users,
    Wrench,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
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
import { useTranslation } from '@/hooks/use-translation';
import { dashboard } from '@/routes';
import { index as adminDashboardIndex } from '@/routes/admin/dashboard';
import { index as adminInvoicesIndex } from '@/routes/admin/invoices';
import { index as adminRoomsIndex } from '@/routes/admin/rooms';
import { index as adminServicesIndex } from '@/routes/admin/services';
import { edit as adminSettingsEdit } from '@/routes/admin/settings';
import { index as adminStaffIndex } from '@/routes/admin/staff';
import { index as invoicesIndex } from '@/routes/invoices';
import { index as maintenanceIndex } from '@/routes/maintenance';
import { index as paymentsIndex } from '@/routes/payments';
import { index as reservationsIndex } from '@/routes/reservations';
import { index as staffHousekeepingIndex } from '@/routes/staff/housekeeping';
import { index as staffMaintenanceIndex } from '@/routes/staff/maintenance';
import { index as staffPaymentsIndex } from '@/routes/staff/payments';
import { index as staffReservationsIndex } from '@/routes/staff/reservations';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;
    const { t } = useTranslation();
    const dashboardHref =
        auth.user?.role === 'admin' ? adminDashboardIndex() : dashboard();

    const mainNavItems: NavItem[] = [
        {
            title: t('nav.dashboard'),
            href: dashboardHref,
            icon: LayoutGrid,
        },
    ];

    const guestNavItems: NavItem[] = [
        {
            title: t('nav.guest.myReservations'),
            href: reservationsIndex(),
            icon: CalendarCheck,
        },
        {
            title: t('nav.guest.myInvoices'),
            href: invoicesIndex(),
            icon: FileText,
        },
        {
            title: t('nav.guest.myPayments'),
            href: paymentsIndex(),
            icon: CreditCard,
        },
        {
            title: t('nav.guest.maintenance'),
            href: maintenanceIndex(),
            icon: Wrench,
        },
    ];

    const staffNavItems: NavItem[] = [
        {
            title: t('nav.staff.reservations'),
            href: staffReservationsIndex(),
            icon: CalendarCheck,
        },
        {
            title: t('nav.staff.payments'),
            href: staffPaymentsIndex(),
            icon: CreditCard,
        },
    ];

    const housekeepingNavItems: NavItem[] = [
        {
            title: t('nav.staff.roomStatus'),
            href: staffHousekeepingIndex(),
            icon: ClipboardList,
        },
        {
            title: t('nav.staff.maintenance'),
            href: staffMaintenanceIndex(),
            icon: Wrench,
        },
    ];

    const adminNavItems: NavItem[] = [
        {
            title: t('nav.admin.rooms'),
            href: adminRoomsIndex(),
            icon: BedDouble,
        },
        {
            title: t('nav.admin.invoices'),
            href: adminInvoicesIndex(),
            icon: FileText,
        },
        {
            title: t('nav.admin.services'),
            href: adminServicesIndex(),
            icon: ConciergeBell,
        },
        {
            title: t('nav.admin.staffAccounts'),
            href: adminStaffIndex(),
            icon: Users,
        },
        {
            title: t('nav.admin.settings'),
            href: adminSettingsEdit(),
            icon: Settings,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-sidebar-border/60">
            <SidebarHeader className="border-b border-sidebar-border/50 p-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="h-auto p-1.5 hover:bg-sidebar-accent/50 rounded-xl transition-all">
                            <Link href={dashboardHref} prefetch className="group/logo">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-1 py-3">
                <NavMain items={mainNavItems} />
                {auth.user?.role === 'guest' && (
                    <NavMain
                        items={guestNavItems}
                        label={t('nav.groups.reservations')}
                    />
                )}
                {(auth.user?.role === 'receptionist' ||
                    auth.user?.role === 'admin') && (
                    <NavMain
                        items={staffNavItems}
                        label={t('nav.groups.staff')}
                    />
                )}
                {(auth.user?.role === 'housekeeping' ||
                    auth.user?.role === 'admin') && (
                    <NavMain
                        items={housekeepingNavItems}
                        label={t('nav.groups.housekeeping')}
                    />
                )}
                {auth.user?.role === 'admin' && (
                    <NavMain
                        items={adminNavItems}
                        label={t('nav.groups.admin')}
                    />
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/50 p-3">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
