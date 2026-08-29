import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    BedDouble,
    Bell,
    CalendarCheck,
    CheckCircle2,
    FileText,
    LogIn,
    LogOut,
    Sparkles,
    Star,
    Wrench,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import HousekeepingController from '@/actions/App/Http/Controllers/Staff/HousekeepingController';
import {
    MaintenancePriorityBadge,
    MaintenanceStatusBadge,
} from '@/components/maintenance-badges';
import ReviewDialog from '@/components/review-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { usePendingAction } from '@/hooks/use-pending-action';
import { useTranslation } from '@/hooks/use-translation';
import { resolveNotificationMessage } from '@/lib/notification-message';
import {
    getInvoiceStatusInfo,
    getReservationStatusInfo,
} from '@/lib/status-badges';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index as invoicesIndex } from '@/routes/invoices';
import { index as notificationsIndex } from '@/routes/notifications';
import { index as reservationsIndex } from '@/routes/reservations';
import { index as staffHousekeepingIndex } from '@/routes/staff/housekeeping';
import { index as staffMaintenanceIndex } from '@/routes/staff/maintenance';
import { index as staffReservationsIndex } from '@/routes/staff/reservations';
import type {
    GuestDashboardData,
    HousekeepingDashboardData,
    ReceptionistDashboardData,
} from '@/types';

type TranslateFn = (
    key: string,
    params?: Record<string, string | number>,
) => string;

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 0 || parts[0] === '') {
        return '?';
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Same status → color mapping used on the admin dashboard's room matrix, kept in sync visually. */
function getRoomStatusInfo(t: TranslateFn, status: string) {
    switch (status) {
        case 'available':
            return {
                bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
                dot: 'bg-emerald-500',
                label: t('common.roomStatus.available'),
            };
        case 'occupied':
            return {
                bg: 'bg-primary/10 border-primary/30 text-primary',
                dot: 'bg-primary',
                label: t('common.roomStatus.occupied'),
            };
        case 'reserved':
            return {
                bg: 'bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300',
                dot: 'bg-purple-500',
                label: t('common.roomStatus.reserved'),
            };
        case 'cleaning':
            return {
                bg: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300',
                dot: 'bg-amber-500',
                label: t('common.roomStatus.cleaning'),
            };
        case 'maintenance':
            return {
                bg: 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300',
                dot: 'bg-rose-500',
                label: t('common.roomStatus.maintenance'),
            };
        default:
            return {
                bg: 'bg-muted border-border text-muted-foreground',
                dot: 'bg-muted-foreground',
                label: status,
            };
    }
}

type Props = Partial<
    GuestDashboardData & ReceptionistDashboardData & HousekeepingDashboardData
>;

function GuestDashboard({
    reservations = [],
    latestInvoice,
    notifications = [],
    reviewableReservations = [],
}: Partial<GuestDashboardData>) {
    const { t } = useTranslation();
    const unreadCount = notifications.filter((n) => !n.is_read).length;
    const latestInvoiceInfo = latestInvoice
        ? getInvoiceStatusInfo(t, latestInvoice.status)
        : null;

    return (
        <div className="w-full flex-1 space-y-5 bg-background p-4 md:p-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {t('dashboard.guest.title')}
            </h1>

            {reviewableReservations.length > 0 && (
                <div className="overflow-hidden rounded-3xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                        <span className="flex size-9 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                            <Star className="size-4.5" />
                        </span>
                        <h2 className="text-base font-bold text-foreground">
                            {t('dashboard.guest.reviewableTitle')}
                        </h2>
                    </div>
                    <div className="space-y-2.5">
                        {reviewableReservations.map((reservation) => (
                            <div
                                key={reservation.id}
                                className="flex items-center justify-between gap-3 rounded-2xl border border-border/50 bg-card p-3.5"
                            >
                                <p className="text-sm font-semibold text-foreground">
                                    {t('common.labels.room')}{' '}
                                    {reservation.room.room_number} ·{' '}
                                    {reservation.room.room_type}
                                </p>
                                <ReviewDialog reservation={reservation} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Snapshot */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Link
                    href={reservationsIndex()}
                    className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <CalendarCheck className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-muted-foreground">
                            {t('dashboard.guest.currentReservations')}
                        </p>
                        <p className="text-xl font-bold tracking-tight text-foreground">
                            {reservations.length}
                        </p>
                    </div>
                </Link>

                <Link
                    href={invoicesIndex()}
                    className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl"
                >
                    <div
                        className={cn(
                            'flex size-12 shrink-0 items-center justify-center rounded-2xl',
                            latestInvoiceInfo?.iconClass ??
                                'bg-muted text-muted-foreground',
                        )}
                    >
                        <FileText className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-muted-foreground">
                            {t('dashboard.guest.latestInvoice')}
                        </p>
                        <p className="text-xl font-bold tracking-tight text-foreground">
                            {latestInvoice
                                ? `$${latestInvoice.total_amount}`
                                : '—'}
                        </p>
                    </div>
                </Link>

                <Link
                    href={notificationsIndex()}
                    className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-xl"
                >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        <Bell className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-muted-foreground">
                            {t('dashboard.guest.recentNotifications')}
                        </p>
                        <p className="text-xl font-bold tracking-tight text-foreground">
                            {unreadCount}
                        </p>
                    </div>
                </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {/* Current reservations */}
                <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b border-border/50 p-4 pb-3">
                        <h2 className="text-base font-bold text-foreground">
                            {t('dashboard.guest.currentReservations')}
                        </h2>
                        <Link
                            href={reservationsIndex()}
                            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary"
                        >
                            {t('common.actions.viewAll')}
                            <ArrowUpRight className="size-3.5" />
                        </Link>
                    </div>
                    {reservations.length === 0 ? (
                        <p className="p-6 text-center text-sm text-muted-foreground">
                            {t('dashboard.guest.noActiveReservations')}
                        </p>
                    ) : (
                        <div className="divide-y divide-border/50">
                            {reservations.map((reservation) => {
                                const statusInfo = getReservationStatusInfo(
                                    t,
                                    reservation.status,
                                );

                                return (
                                    <div
                                        key={reservation.id}
                                        className="flex items-center justify-between gap-3 p-3.5"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                                                #{reservation.room.room_number}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-foreground">
                                                    {reservation.room.room_type}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {t(
                                                        `common.reservationType.${reservation.reservation_type}`,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                'shrink-0 gap-1 font-semibold',
                                                statusInfo.className,
                                            )}
                                        >
                                            {statusInfo.pulse && (
                                                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                                            )}
                                            {statusInfo.label}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Latest invoice */}
                <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b border-border/50 p-4 pb-3">
                        <h2 className="text-base font-bold text-foreground">
                            {t('dashboard.guest.latestInvoice')}
                        </h2>
                        <Link
                            href={invoicesIndex()}
                            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary"
                        >
                            {t('common.actions.viewAll')}
                            <ArrowUpRight className="size-3.5" />
                        </Link>
                    </div>
                    {latestInvoice && latestInvoiceInfo ? (
                        <Link
                            href={invoicesIndex()}
                            className="flex items-center justify-between gap-3 p-5 transition-colors hover:bg-muted/30"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        'flex size-11 shrink-0 items-center justify-center rounded-2xl',
                                        latestInvoiceInfo.iconClass,
                                    )}
                                >
                                    <latestInvoiceInfo.icon className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">
                                        {t('common.labels.room')}{' '}
                                        {latestInvoice.room.room_number}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {latestInvoiceInfo.label}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                ${latestInvoice.total_amount}
                            </span>
                        </Link>
                    ) : (
                        <p className="p-6 text-center text-sm text-muted-foreground">
                            {t('dashboard.guest.noInvoices')}
                        </p>
                    )}
                </div>
            </div>

            {/* Notifications */}
            <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border/50 p-4 pb-3">
                    <h2 className="text-base font-bold text-foreground">
                        {t('dashboard.guest.recentNotifications')}
                    </h2>
                    <Link
                        href={notificationsIndex()}
                        className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary"
                    >
                        {t('common.actions.viewAll')}
                        <ArrowUpRight className="size-3.5" />
                    </Link>
                </div>
                {notifications.length === 0 ? (
                    <p className="p-6 text-center text-sm text-muted-foreground">
                        {t('dashboard.guest.noNotifications')}
                    </p>
                ) : (
                    <div className="divide-y divide-border/50">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={cn(
                                    'flex items-start gap-3 p-3.5',
                                    !notification.is_read && 'bg-muted/30',
                                )}
                            >
                                <span
                                    className={cn(
                                        'mt-1.5 size-2 shrink-0 rounded-full',
                                        notification.is_read
                                            ? 'bg-transparent'
                                            : 'bg-primary',
                                    )}
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-foreground">
                                        {resolveNotificationMessage(
                                            t,
                                            notification,
                                        )}
                                    </p>
                                    {notification.created_at && (
                                        <p className="text-xs text-muted-foreground">
                                            {notification.created_at}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ReceptionistDashboard({
    arrivals = [],
    departures = [],
    rooms = [],
}: Partial<ReceptionistDashboardData>) {
    const { t } = useTranslation();
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const statusCounts = useMemo(() => {
        const counts = {
            available: 0,
            occupied: 0,
            reserved: 0,
            cleaning: 0,
            maintenance: 0,
        };

        for (const room of rooms) {
            if (room.status in counts) {
                counts[room.status as keyof typeof counts] += 1;
            }
        }

        return counts;
    }, [rooms]);

    const filteredRooms = useMemo(
        () =>
            statusFilter === 'all'
                ? rooms
                : rooms.filter((room) => room.status === statusFilter),
        [rooms, statusFilter],
    );

    const filterTabs = [
        {
            id: 'all',
            label: `${t('dashboard.receptionist.allRoomsFilter')} (${rooms.length})`,
        },
        {
            id: 'available',
            label: `${t('common.roomStatus.available')} (${statusCounts.available})`,
        },
        {
            id: 'occupied',
            label: `${t('common.roomStatus.occupied')} (${statusCounts.occupied})`,
        },
        {
            id: 'reserved',
            label: `${t('common.roomStatus.reserved')} (${statusCounts.reserved})`,
        },
        {
            id: 'cleaning',
            label: `${t('common.roomStatus.cleaning')} (${statusCounts.cleaning})`,
        },
        {
            id: 'maintenance',
            label: `${t('common.roomStatus.maintenance')} (${statusCounts.maintenance})`,
        },
    ];

    return (
        <div className="w-full flex-1 space-y-5 bg-background p-4 md:p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {t('dashboard.receptionist.title')}
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    {t('dashboard.receptionist.subtitle')}
                </p>
            </div>

            {/* Today's operational pulse */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Link
                    href={staffReservationsIndex()}
                    className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <LogIn className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-muted-foreground">
                            {t('dashboard.receptionist.statArrivals')}
                        </p>
                        <p className="text-xl font-bold tracking-tight text-foreground">
                            {arrivals.length}
                        </p>
                    </div>
                </Link>

                <Link
                    href={staffReservationsIndex()}
                    className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-xl"
                >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        <LogOut className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-muted-foreground">
                            {t('dashboard.receptionist.statDepartures')}
                        </p>
                        <p className="text-xl font-bold tracking-tight text-foreground">
                            {departures.length}
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-5 shadow-sm">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-muted-foreground">
                            {t('dashboard.receptionist.statAvailable')}
                        </p>
                        <p className="text-xl font-bold tracking-tight text-foreground">
                            {statusCounts.available}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-5 shadow-sm">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Sparkles className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-muted-foreground">
                            {t('dashboard.receptionist.statNeedsAttention')}
                        </p>
                        <p className="text-xl font-bold tracking-tight text-foreground">
                            {statusCounts.cleaning + statusCounts.maintenance}
                        </p>
                    </div>
                </div>
            </div>

            {/* Arrivals / departures */}
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
                    <div className="border-b border-border/50 p-4 pb-3">
                        <h2 className="text-base font-bold text-foreground">
                            {t('dashboard.receptionist.todaysArrivals', {
                                count: arrivals.length,
                            })}
                        </h2>
                    </div>
                    {arrivals.length === 0 ? (
                        <p className="p-6 text-center text-sm text-muted-foreground">
                            {t('dashboard.receptionist.noArrivals')}
                        </p>
                    ) : (
                        <div className="divide-y divide-border/50">
                            {arrivals.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center justify-between gap-3 p-3.5"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                                            {getInitials(entry.guest.full_name)}
                                        </div>
                                        <p className="truncate text-sm font-bold text-foreground">
                                            {entry.guest.full_name}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="shrink-0 font-semibold"
                                    >
                                        #{entry.room.room_number}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
                    <div className="border-b border-border/50 p-4 pb-3">
                        <h2 className="text-base font-bold text-foreground">
                            {t('dashboard.receptionist.todaysDepartures', {
                                count: departures.length,
                            })}
                        </h2>
                    </div>
                    {departures.length === 0 ? (
                        <p className="p-6 text-center text-sm text-muted-foreground">
                            {t('dashboard.receptionist.noDepartures')}
                        </p>
                    ) : (
                        <div className="divide-y divide-border/50">
                            {departures.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center justify-between gap-3 p-3.5"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-xs font-bold text-purple-600 dark:text-purple-400">
                                            {getInitials(entry.guest.full_name)}
                                        </div>
                                        <p className="truncate text-sm font-bold text-foreground">
                                            {entry.guest.full_name}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="shrink-0 font-semibold"
                                    >
                                        #{entry.room.room_number}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Live room status grid */}
            <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
                <div className="flex flex-col gap-3 border-b border-border/60 p-4 pb-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <BedDouble className="size-5 text-primary" />
                            <h2 className="text-base font-bold text-foreground">
                                {t('dashboard.receptionist.roomOverviewTitle')}
                            </h2>
                        </div>
                        <p className="pt-0.5 text-xs text-muted-foreground">
                            {t('dashboard.receptionist.roomOverviewSubtitle')}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setStatusFilter(tab.id)}
                                className={cn(
                                    'cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold transition-all',
                                    statusFilter === tab.id
                                        ? 'bg-primary text-primary-foreground shadow-2xs'
                                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 sm:p-5">
                    {filteredRooms.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            {rooms.length === 0
                                ? t('dashboard.receptionist.noRooms')
                                : t('dashboard.receptionist.noRoomsMatch')}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                            {filteredRooms.map((room) => {
                                const statusInfo = getRoomStatusInfo(
                                    t,
                                    room.status,
                                );

                                return (
                                    <div
                                        key={room.id}
                                        className="flex flex-col justify-between rounded-2xl border border-border/50 bg-background p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-bold tracking-tight text-foreground">
                                                #{room.room_number}
                                            </span>
                                            <span
                                                className={cn(
                                                    'size-2 rounded-full',
                                                    statusInfo.dot,
                                                )}
                                            />
                                        </div>
                                        <div className="mt-2 space-y-1.5">
                                            <div className="truncate text-xs font-medium text-muted-foreground capitalize">
                                                {room.room_type}
                                            </div>
                                            <div
                                                className={cn(
                                                    'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-semibold',
                                                    statusInfo.bg,
                                                )}
                                            >
                                                {statusInfo.label}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function HousekeepingDashboard({
    roomsAwaitingCleaning = 0,
    openAssignedMaintenance = 0,
    cleaningRooms = [],
    assignedMaintenance = [],
}: Partial<HousekeepingDashboardData>) {
    const { t } = useTranslation();
    const { isPending, withPending } = usePendingAction();

    const markClean = (roomId: string) => {
        router.patch(
            HousekeepingController.markClean.url(roomId),
            {},
            withPending(`clean-${roomId}`, { preserveScroll: true }),
        );
    };

    return (
        <div className="w-full flex-1 space-y-5 bg-background p-4 md:p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {t('dashboard.housekeeping.title')}
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    {t('dashboard.housekeeping.subtitle')}
                </p>
            </div>

            {/* Snapshot */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                    href={staffHousekeepingIndex()}
                    className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl"
                >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Sparkles className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-muted-foreground">
                            {t('dashboard.housekeeping.roomsAwaitingCleaning')}
                        </p>
                        <p className="text-xl font-bold tracking-tight text-foreground">
                            {roomsAwaitingCleaning}
                        </p>
                    </div>
                </Link>

                <Link
                    href={staffMaintenanceIndex()}
                    className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/40 hover:shadow-xl"
                >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                        <Wrench className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-muted-foreground">
                            {t(
                                'dashboard.housekeeping.openAssignedMaintenance',
                            )}
                        </p>
                        <p className="text-xl font-bold tracking-tight text-foreground">
                            {openAssignedMaintenance}
                        </p>
                    </div>
                </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {/* Rooms to clean */}
                <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b border-border/50 p-4 pb-3">
                        <h2 className="text-base font-bold text-foreground">
                            {t('dashboard.housekeeping.cleaningListTitle')}
                        </h2>
                        <Link
                            href={staffHousekeepingIndex()}
                            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary"
                        >
                            {t('common.actions.viewAll')}
                            <ArrowUpRight className="size-3.5" />
                        </Link>
                    </div>
                    {cleaningRooms.length === 0 ? (
                        <p className="p-6 text-center text-sm text-muted-foreground">
                            {t('dashboard.housekeeping.noCleaningRooms')}
                        </p>
                    ) : (
                        <div className="divide-y divide-border/50">
                            {cleaningRooms.map((room) => (
                                <div
                                    key={room.id}
                                    className="flex items-center justify-between gap-3 p-3.5"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                            <BedDouble className="size-4.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-foreground">
                                                #{room.room_number} ·{' '}
                                                {room.room_type}
                                            </p>
                                            {room.floor !== null && (
                                                <p className="text-xs text-muted-foreground">
                                                    {t(
                                                        'staff.housekeeping.table.floor',
                                                    )}{' '}
                                                    {room.floor}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="h-8 shrink-0 gap-1.5 rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-2xs transition-transform hover:scale-105"
                                        disabled={isPending(`clean-${room.id}`)}
                                        onClick={() => markClean(room.id)}
                                    >
                                        {isPending(`clean-${room.id}`) ? (
                                            <Spinner className="size-3.5" />
                                        ) : (
                                            <CheckCircle2 className="size-3.5" />
                                        )}
                                        {t('staff.housekeeping.markClean')}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* My assigned maintenance */}
                <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b border-border/50 p-4 pb-3">
                        <h2 className="text-base font-bold text-foreground">
                            {t('dashboard.housekeeping.maintenanceListTitle')}
                        </h2>
                        <Link
                            href={staffMaintenanceIndex()}
                            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary"
                        >
                            {t('common.actions.viewAll')}
                            <ArrowUpRight className="size-3.5" />
                        </Link>
                    </div>
                    {assignedMaintenance.length === 0 ? (
                        <p className="p-6 text-center text-sm text-muted-foreground">
                            {t('dashboard.housekeeping.noAssignedMaintenance')}
                        </p>
                    ) : (
                        <div className="divide-y divide-border/50">
                            {assignedMaintenance.map((request) => (
                                <div
                                    key={request.id}
                                    className="flex items-center justify-between gap-3 p-3.5"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-xs font-bold text-rose-600 dark:text-rose-400">
                                            #{request.room.room_number}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-foreground">
                                                {request.title}
                                            </p>
                                            <MaintenanceStatusBadge
                                                status={request.status}
                                            />
                                        </div>
                                    </div>
                                    <MaintenancePriorityBadge
                                        priority={request.priority}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Dashboard(props: Props) {
    const { auth } = usePage().props;
    const { t } = useTranslation();
    const role = auth.user?.role;

    return (
        <>
            <Head title={t('nav.dashboard')} />
            {(role === 'receptionist' || role === 'admin') && (
                <ReceptionistDashboard
                    arrivals={props.arrivals}
                    departures={props.departures}
                    rooms={props.rooms}
                />
            )}
            {role === 'housekeeping' && (
                <HousekeepingDashboard
                    roomsAwaitingCleaning={props.roomsAwaitingCleaning}
                    openAssignedMaintenance={props.openAssignedMaintenance}
                    cleaningRooms={props.cleaningRooms}
                    assignedMaintenance={props.assignedMaintenance}
                />
            )}
            {role === 'guest' && (
                <GuestDashboard
                    reservations={props.reservations}
                    latestInvoice={props.latestInvoice ?? null}
                    notifications={props.notifications}
                    reviewableReservations={props.reviewableReservations}
                />
            )}
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
