import { Link, usePage } from '@inertiajs/react';
import {
    BedDouble,
    BellRing,
    CalendarCheck,
    ClipboardList,
    ConciergeBell,
    CreditCard,
    FileText,
    History,
    LayoutGrid,
    LineChart,
    Settings,
    Tag,
    Users,
    Wrench,
} from 'lucide-react';
import { Fragment } from 'react';
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
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { useTranslation } from '@/hooks/use-translation';
import { dashboard } from '@/routes';
import { index as adminActivityLogIndex } from '@/routes/admin/activity-log';
import { index as adminDashboardIndex } from '@/routes/admin/dashboard';
import { index as adminInvoicesIndex } from '@/routes/admin/invoices';
import { index as adminPromoCodesIndex } from '@/routes/admin/promo-codes';
import { index as adminReportsIndex } from '@/routes/admin/reports';
import { index as adminRoomsIndex } from '@/routes/admin/rooms';
import { index as adminServicesIndex } from '@/routes/admin/services';
import { edit as adminSettingsEdit } from '@/routes/admin/settings';
import { index as adminStaffIndex } from '@/routes/admin/staff';
import { index as adminWaitlistIndex } from '@/routes/admin/waitlist';
import { index as invoicesIndex } from '@/routes/invoices';
import { index as maintenanceIndex } from '@/routes/maintenance';
import { index as paymentsIndex } from '@/routes/payments';
import { index as reservationsIndex } from '@/routes/reservations';
import { index as staffHousekeepingIndex } from '@/routes/staff/housekeeping';
import { index as staffMaintenanceIndex } from '@/routes/staff/maintenance';
import { index as staffPaymentsIndex } from '@/routes/staff/payments';
import { index as staffReservationsIndex } from '@/routes/staff/reservations';
import type { NavItem, SidebarBadgeCounts, User } from '@/types';

type Role = User['role'];

type Translate = (
    key: string,
    params?: Record<string, string | number>,
) => string;

type NavSection = {
    id: string;
    label: string;
    items: NavItem[];
};

/**
 * The nav below the Dashboard link, for one role only.
 *
 * Each role returns its own sections so a guest never builds — or resolves the
 * routes for — the admin nav. Roles are mutually exclusive, so a switch keeps
 * the permitted surface for each one readable in a single place.
 */
function navSectionsFor(
    role: Role | undefined,
    t: Translate,
    badges: SidebarBadgeCounts,
): NavSection[] {
    switch (role) {
        case 'admin':
            return [
                {
                    id: 'operations',
                    label: t('nav.groups.operations'),
                    items: [
                        {
                            title: t('nav.staff.reservations'),
                            href: staffReservationsIndex(),
                            icon: CalendarCheck,
                            badge: badges.reservationsPending,
                        },
                        {
                            title: t('nav.admin.rooms'),
                            href: adminRoomsIndex(),
                            icon: BedDouble,
                        },
                        {
                            title: t('nav.staff.roomStatus'),
                            href: staffHousekeepingIndex(),
                            icon: ClipboardList,
                            badge: badges.roomsAwaitingCleaning,
                        },
                        {
                            title: t('nav.admin.waitlist'),
                            href: adminWaitlistIndex(),
                            icon: BellRing,
                        },
                    ],
                },
                {
                    id: 'finance',
                    label: t('nav.groups.finance'),
                    items: [
                        {
                            title: t('nav.admin.invoices'),
                            href: adminInvoicesIndex(),
                            icon: FileText,
                        },
                        {
                            title: t('nav.staff.payments'),
                            href: staffPaymentsIndex(),
                            icon: CreditCard,
                            badge: badges.paymentsPending,
                        },
                        {
                            title: t('nav.admin.services'),
                            href: adminServicesIndex(),
                            icon: ConciergeBell,
                        },
                        {
                            title: t('nav.admin.reports'),
                            href: adminReportsIndex(),
                            icon: LineChart,
                        },
                        {
                            title: t('nav.admin.promoCodes'),
                            href: adminPromoCodesIndex(),
                            icon: Tag,
                        },
                    ],
                },
                {
                    id: 'maintenance',
                    label: t('nav.groups.maintenance'),
                    items: [
                        {
                            title: t('nav.staff.maintenance'),
                            href: staffMaintenanceIndex(),
                            icon: Wrench,
                            badge: badges.maintenanceOpen,
                        },
                    ],
                },
                {
                    id: 'management',
                    label: t('nav.groups.management'),
                    items: [
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
                        {
                            title: t('nav.admin.activityLog'),
                            href: adminActivityLogIndex(),
                            icon: History,
                        },
                    ],
                },
            ];

        case 'receptionist':
            return [
                {
                    id: 'operations',
                    label: t('nav.groups.operations'),
                    items: [
                        {
                            title: t('nav.staff.reservations'),
                            href: staffReservationsIndex(),
                            icon: CalendarCheck,
                            badge: badges.reservationsPending,
                        },
                    ],
                },
                {
                    id: 'finance',
                    label: t('nav.groups.finance'),
                    items: [
                        {
                            title: t('nav.staff.payments'),
                            href: staffPaymentsIndex(),
                            icon: CreditCard,
                            badge: badges.paymentsPending,
                        },
                    ],
                },
            ];

        case 'housekeeping':
            return [
                {
                    id: 'operations',
                    label: t('nav.groups.operations'),
                    items: [
                        {
                            title: t('nav.staff.roomStatus'),
                            href: staffHousekeepingIndex(),
                            icon: ClipboardList,
                            badge: badges.roomsAwaitingCleaning,
                        },
                    ],
                },
                {
                    id: 'maintenance',
                    label: t('nav.groups.maintenance'),
                    items: [
                        {
                            title: t('nav.staff.maintenance'),
                            href: staffMaintenanceIndex(),
                            icon: Wrench,
                            badge: badges.maintenanceOpen,
                        },
                    ],
                },
            ];

        default:
            return [
                {
                    id: 'reservations',
                    label: t('nav.groups.reservations'),
                    items: [
                        {
                            title: t('nav.guest.myReservations'),
                            href: reservationsIndex(),
                            icon: CalendarCheck,
                        },
                        {
                            title: t('nav.guest.myInvoices'),
                            href: invoicesIndex(),
                            icon: FileText,
                            badge: badges.unpaidInvoices,
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
                    ],
                },
            ];
    }
}

function initialsOf(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

export function AppSidebar() {
    const { auth, sidebarBadges } = usePage().props;
    const { t } = useTranslation();

    const user = auth.user;
    const role = user?.role;
    const dashboardHref =
        role === 'admin' ? adminDashboardIndex() : dashboard();
    const sections = navSectionsFor(role, t, sidebarBadges ?? {});

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-sidebar-border/50 p-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-auto rounded-xl p-1.5 transition-all hover:bg-sidebar-accent/50"
                        >
                            <Link
                                href={dashboardHref}
                                prefetch="click"
                                className="group/logo"
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-0.5 py-3">
                <NavMain
                    items={[
                        {
                            title: t('nav.dashboard'),
                            href: dashboardHref,
                            icon: LayoutGrid,
                        },
                    ]}
                />

                <SidebarSeparator className="my-2" />

                {sections.map((section, index) => (
                    <Fragment key={section.id}>
                        <NavMain items={section.items} label={section.label} />
                        {index < sections.length - 1 && (
                            <SidebarSeparator className="my-2" />
                        )}
                    </Fragment>
                ))}
            </SidebarContent>

            <SidebarFooter className="gap-2 border-t border-sidebar-border/50 p-3">
                {user && (
                    <div className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent/60">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-[12px] font-semibold text-secondary-foreground">
                            {initialsOf(user.full_name)}
                        </span>
                        {/*
                         * leading-normal, not leading-tight: a Khmer full_name stacks
                         * subscript consonants below the baseline and clips at 1.25.
                         */}
                        <span className="grid min-w-0 flex-1 text-left leading-normal">
                            <span className="truncate text-[13px] font-semibold">
                                {user.full_name}
                            </span>
                            <span className="truncate text-[11px] text-muted-foreground">
                                {user.email}
                            </span>
                        </span>
                    </div>
                )}

                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
