import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    BedDouble,
    CheckCircle2,
    CreditCard,
    DollarSign,
    FileText,
    Hotel,
    LogIn,
    LogOut,
    Plus,
    Sparkles,
    Wrench,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import RevenueTrendChart from '@/components/charts/revenue-trend-chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { index as adminDashboardIndex } from '@/routes/admin/dashboard';
import { index as adminInvoicesIndex } from '@/routes/admin/invoices';
import { index as adminRoomsIndex } from '@/routes/admin/rooms';
import { index as staffHousekeepingIndex } from '@/routes/staff/housekeeping';
import { index as staffMaintenanceIndex } from '@/routes/staff/maintenance';
import { index as staffPaymentsIndex } from '@/routes/staff/payments';
import { index as staffReservationsIndex } from '@/routes/staff/reservations';
import type { AdminDashboardData } from '@/types/dashboard';

type Props = AdminDashboardData;

export default function AdminDashboard({
    occupancy,
    revenueThisMonth,
    outstandingInvoicesCount,
    openMaintenanceCount,
    revenueTrend,
    roomStatusCounts = {
        available: 0,
        occupied: 0,
        reserved: 0,
        cleaning: 0,
        maintenance: 0,
    },
    todayCheckIns = 0,
    todayCheckOuts = 0,
    roomsList = [],
    recentReservations = [],
    recentPayments = [],
}: Props) {
    const { auth } = usePage().props;
    const { t } = useTranslation();
    const [selectedRoomStatusFilter, setSelectedRoomStatusFilter] =
        useState<string>('all');

    const totalRooms = occupancy?.total_rooms ?? 0;
    const occupiedCount =
        (occupancy?.short_stay ?? 0) + (occupancy?.long_stay ?? 0);
    const occupancyRate =
        totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

    // Filtered rooms in the Live Room Grid
    const filteredRooms = useMemo(() => {
        if (selectedRoomStatusFilter === 'all') return roomsList;
        return roomsList.filter(
            (room) => room.status === selectedRoomStatusFilter,
        );
    }, [roomsList, selectedRoomStatusFilter]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const getInitials = (name: string) => {
        if (!name) return 'G';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const getRoomStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return {
                    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
                    dot: 'bg-emerald-500',
                    label: t('adminDashboard.roomStatus.available'),
                };
            case 'occupied':
                return {
                    bg: 'bg-primary/10 border-primary/30 text-primary dark:text-primary-foreground',
                    dot: 'bg-primary',
                    label: t('adminDashboard.roomStatus.occupied'),
                };
            case 'reserved':
                return {
                    bg: 'bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300',
                    dot: 'bg-purple-500',
                    label: t('adminDashboard.roomStatus.reserved'),
                };
            case 'cleaning':
                return {
                    bg: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300',
                    dot: 'bg-amber-500',
                    label: t('adminDashboard.roomStatus.cleaning'),
                };
            case 'maintenance':
                return {
                    bg: 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300',
                    dot: 'bg-rose-500',
                    label: t('adminDashboard.roomStatus.maintenance'),
                };
            default:
                return {
                    bg: 'bg-muted border-border text-muted-foreground',
                    dot: 'bg-muted-foreground',
                    label: status,
                };
        }
    };

    const getReservationStatusBadge = (status: string) => {
        const label = t(`common.reservationStatus.${status}`);

        switch (status) {
            case 'confirmed':
                return (
                    <Badge
                        variant="outline"
                        className="border-primary/40 bg-primary/10 font-sans text-xs font-semibold text-primary"
                    >
                        {label}
                    </Badge>
                );
            case 'checked_in':
            case 'active':
                return (
                    <Badge
                        variant="outline"
                        className="gap-1 border-emerald-500/40 bg-emerald-500/10 font-sans text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                    >
                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                        {label}
                    </Badge>
                );
            case 'checked_out':
            case 'expired':
                return (
                    <Badge
                        variant="outline"
                        className="border-border bg-muted/50 font-sans text-xs text-muted-foreground"
                    >
                        {label}
                    </Badge>
                );
            case 'cancelled':
            case 'terminated':
                return (
                    <Badge
                        variant="outline"
                        className="border-rose-500/40 bg-rose-500/10 font-sans text-xs text-rose-600 dark:text-rose-400"
                    >
                        {label}
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-500/40 bg-amber-500/10 font-sans text-xs text-amber-700"
                    >
                        {label}
                    </Badge>
                );
        }
    };

    return (
        <>
            <Head title={t('adminDashboard.title')} />

            <div className="w-full flex-1 space-y-5 bg-background p-4 md:p-6">
                {/* 1. Glassmorphic Header */}
                <div className="flex flex-col gap-4 rounded-3xl border border-border/50 bg-card/50 p-6 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            {t('adminDashboard.greeting', {
                                name: String(auth?.user?.name || 'Admin'),
                            })}
                        </h1>
                        <p className="mt-0.5 font-sans text-sm text-muted-foreground">
                            {t('adminDashboard.subtitle')}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <Button
                            asChild
                            size="sm"
                            className="h-10 gap-2 rounded-xl px-4 font-sans text-sm font-semibold shadow-2xs"
                        >
                            <Link href={staffReservationsIndex()}>
                                <Plus className="size-4" />
                                {t('adminDashboard.quickActions.reservations')}
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-10 gap-2 rounded-xl border-border bg-card px-3.5 font-sans text-sm shadow-2xs hover:bg-accent"
                        >
                            <Link href={adminRoomsIndex()}>
                                <BedDouble className="size-4 text-muted-foreground" />
                                {t('adminDashboard.quickActions.manageRooms')}
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-10 gap-2 rounded-xl border-border bg-card px-3.5 font-sans text-sm shadow-2xs hover:bg-accent"
                        >
                            <Link href={adminInvoicesIndex()}>
                                <FileText className="size-4 text-muted-foreground" />
                                {t('adminDashboard.quickActions.invoices')}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* 2. Today's Front-Desk Operational Pulse */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                    <Link
                        href={staffReservationsIndex()}
                        className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                    >
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <LogIn className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate font-sans text-xs font-medium text-muted-foreground">
                                {t('adminDashboard.operations.todayCheckIns')}
                            </p>
                            <p className="font-sans text-xl font-bold tracking-tight text-foreground">
                                {todayCheckIns}{' '}
                                <span className="text-xs font-normal text-muted-foreground">
                                    {t('adminDashboard.operations.roomsUnit')}
                                </span>
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
                            <p className="truncate font-sans text-xs font-medium text-muted-foreground">
                                {t('adminDashboard.operations.todayCheckOuts')}
                            </p>
                            <p className="font-sans text-xl font-bold tracking-tight text-foreground">
                                {todayCheckOuts}{' '}
                                <span className="text-xs font-normal text-muted-foreground">
                                    {t('adminDashboard.operations.roomsUnit')}
                                </span>
                            </p>
                        </div>
                    </Link>

                    <Link
                        href={staffHousekeepingIndex()}
                        className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl"
                    >
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <Sparkles className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate font-sans text-xs font-medium text-muted-foreground">
                                {t('adminDashboard.roomStatus.cleaning')}
                            </p>
                            <p className="font-sans text-xl font-bold tracking-tight text-foreground">
                                {roomStatusCounts.cleaning}{' '}
                                <span className="text-xs font-normal text-muted-foreground">
                                    {t('adminDashboard.operations.dirtyUnit')}
                                </span>
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
                            <p className="truncate font-sans text-xs font-medium text-muted-foreground">
                                {t(
                                    'adminDashboard.stats.openMaintenanceRequests',
                                )}
                            </p>
                            <p className="font-sans text-xl font-bold tracking-tight text-foreground">
                                {openMaintenanceCount}{' '}
                                <span className="text-xs font-normal text-muted-foreground">
                                    {t('adminDashboard.operations.pendingUnit')}
                                </span>
                            </p>
                        </div>
                    </Link>
                </div>

                {/* 3. Core Financial & Performance Metric Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Revenue Card */}
                    <Link
                        href={staffPaymentsIndex()}
                        className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl"
                    >
                        <div className="flex items-center justify-between pb-2">
                            <span className="font-sans text-sm font-medium text-muted-foreground">
                                {t('adminDashboard.stats.revenueThisMonth')}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <DollarSign className="size-4.5" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                {formatCurrency(revenueThisMonth)}
                            </div>
                            <p className="flex items-center gap-1.5 pt-1 font-sans text-xs text-muted-foreground">
                                <span className="inline-flex items-center font-semibold text-emerald-600 dark:text-emerald-400">
                                    ● {t('adminDashboard.stats.activeLabel')}
                                </span>
                                {t('adminDashboard.stats.revenueSubtitle')}
                            </p>
                        </div>
                    </Link>

                    {/* Occupancy Card */}
                    <Link
                        href={adminRoomsIndex()}
                        className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                    >
                        <div className="flex items-center justify-between pb-2">
                            <span className="font-sans text-sm font-medium text-muted-foreground">
                                {t('adminDashboard.stats.occupancyRate')}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <BedDouble className="size-4.5" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                                <span className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                    {occupancyRate}%
                                </span>
                                <span className="font-sans text-xs font-semibold text-muted-foreground">
                                    ({occupiedCount} / {totalRooms}{' '}
                                    {t('adminDashboard.operations.roomsUnit')})
                                </span>
                            </div>
                            <div className="flex items-center gap-2 pt-1.5">
                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all duration-500"
                                        style={{ width: `${occupancyRate}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Unpaid Invoices */}
                    <Link
                        href={adminInvoicesIndex()}
                        className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl"
                    >
                        <div className="flex items-center justify-between pb-2">
                            <span className="font-sans text-sm font-medium text-muted-foreground">
                                {t('adminDashboard.stats.outstandingInvoices')}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <FileText className="size-4.5" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                                <span className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                    {outstandingInvoicesCount}
                                </span>
                                {outstandingInvoicesCount > 0 && (
                                    <Badge
                                        variant="outline"
                                        className="border-amber-500/30 bg-amber-500/10 font-sans text-xs text-amber-700 dark:text-amber-300"
                                    >
                                        {t(
                                            'adminDashboard.stats.invoicesBadge',
                                        )}
                                    </Badge>
                                )}
                            </div>
                            <p className="pt-1 font-sans text-xs text-muted-foreground">
                                {t('adminDashboard.stats.invoicesSubtitle')}
                            </p>
                        </div>
                    </Link>

                    {/* Available Inventory */}
                    <Link
                        href={adminRoomsIndex({
                            query: { status: 'available' },
                        })}
                        className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl"
                    >
                        <div className="flex items-center justify-between pb-2">
                            <span className="font-sans text-sm font-medium text-muted-foreground">
                                {t('adminDashboard.roomStatus.available')}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="size-4.5" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                {roomStatusCounts.available}{' '}
                                <span className="font-sans text-sm font-normal text-muted-foreground">
                                    {t('adminDashboard.stats.availableBadge')}
                                </span>
                            </div>
                            <p className="pt-1 font-sans text-xs text-muted-foreground">
                                {t('adminDashboard.stats.availableSubtitle')}
                            </p>
                        </div>
                    </Link>
                </div>

                {/* 4. Live Room Matrix Rack (The Heartbeat of the Guest House) */}
                <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-border/60 p-4 pb-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <Hotel className="size-5 text-primary" />
                                <h2 className="font-sans text-base font-bold text-foreground">
                                    {t('adminDashboard.operations.roomMatrix')}
                                </h2>
                            </div>
                            <p className="pt-0.5 font-sans text-xs text-muted-foreground">
                                {t(
                                    'adminDashboard.operations.roomMatrixSubtitle',
                                )}
                            </p>
                        </div>

                        {/* Filter tabs */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            {[
                                {
                                    id: 'all',
                                    label: `${t('adminDashboard.operations.allRoomsFilter')} (${roomsList.length})`,
                                },
                                {
                                    id: 'available',
                                    label: `${t('adminDashboard.roomStatus.available')} (${roomStatusCounts.available})`,
                                },
                                {
                                    id: 'occupied',
                                    label: `${t('adminDashboard.roomStatus.occupied')} (${roomStatusCounts.occupied})`,
                                },
                                {
                                    id: 'cleaning',
                                    label: `${t('adminDashboard.roomStatus.cleaning')} (${roomStatusCounts.cleaning})`,
                                },
                                {
                                    id: 'maintenance',
                                    label: `${t('adminDashboard.roomStatus.maintenance')} (${roomStatusCounts.maintenance})`,
                                },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() =>
                                        setSelectedRoomStatusFilter(tab.id)
                                    }
                                    className={`cursor-pointer rounded-xl px-3 py-1.5 font-sans text-xs font-semibold transition-all ${
                                        selectedRoomStatusFilter === tab.id
                                            ? 'bg-primary text-primary-foreground shadow-2xs'
                                            : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 sm:p-5">
                        {filteredRooms.length === 0 ? (
                            <div className="py-8 text-center font-sans text-sm text-muted-foreground">
                                {t('adminDashboard.operations.noRoomsMatch')}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                                {filteredRooms.map((room) => {
                                    const statusInfo = getRoomStatusColor(
                                        room.status,
                                    );

                                    return (
                                        <Link
                                            key={room.id}
                                            href={adminRoomsIndex()}
                                            className="group relative flex flex-col justify-between rounded-2xl border border-border/50 bg-background p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-sans text-base font-bold tracking-tight text-foreground group-hover:text-primary">
                                                    #{room.room_number}
                                                </span>
                                                <span
                                                    className={`size-2 rounded-full ${statusInfo.dot}`}
                                                />
                                            </div>

                                            <div className="mt-2 space-y-1.5">
                                                <div className="truncate font-sans text-xs font-medium text-muted-foreground capitalize">
                                                    {room.room_type}
                                                </div>
                                                <div
                                                    className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-semibold ${statusInfo.bg} font-sans`}
                                                >
                                                    {statusInfo.label}
                                                </div>
                                            </div>

                                            <div className="mt-2.5 flex items-center justify-between border-t border-border/40 pt-2 font-sans text-[11.5px] font-semibold text-foreground">
                                                <span>
                                                    ${room.price_per_night}
                                                </span>
                                                <span className="text-[10px] font-normal text-muted-foreground">
                                                    / night
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* 5. Analytics & Live Operational Feeds Split */}
                <div className="grid gap-5 lg:grid-cols-12">
                    {/* 14-Day Revenue Analytics (7 cols) */}
                    <div className="lg:col-span-7">
                        <RevenueTrendChart revenueTrend={revenueTrend} />
                    </div>

                    {/* Operational Feed: Recent Bookings & Payments (5 cols) */}
                    <div className="space-y-5 lg:col-span-5">
                        {/* Recent Bookings Feed */}
                        <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
                            <div className="flex items-center justify-between border-b border-border/50 p-4 pb-3">
                                <div>
                                    <h3 className="font-sans text-base font-bold text-foreground">
                                        {t(
                                            'adminDashboard.recentBookings.title',
                                        )}
                                    </h3>
                                    <p className="font-sans text-xs text-muted-foreground">
                                        {t(
                                            'adminDashboard.recentBookings.subtitle',
                                        )}
                                    </p>
                                </div>
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 gap-1 font-sans text-xs text-primary hover:text-primary"
                                >
                                    <Link href={staffReservationsIndex()}>
                                        {t('common.actions.viewAll')}
                                        <ArrowUpRight className="size-3.5" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="divide-y divide-border/50">
                                {recentReservations.length === 0 ? (
                                    <div className="p-6 text-center font-sans text-sm text-muted-foreground">
                                        {t(
                                            'adminDashboard.recentBookings.noBookings',
                                        )}
                                    </div>
                                ) : (
                                    recentReservations.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center justify-between p-3.5 transition-colors hover:bg-muted/30"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-sans text-xs font-bold text-primary">
                                                    {getInitials(
                                                        booking.guest_name,
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-sans text-sm font-bold text-foreground">
                                                        {booking.guest_name}
                                                    </p>
                                                    <p className="flex items-center gap-1.5 truncate font-sans text-xs text-muted-foreground">
                                                        <span className="font-semibold text-foreground">
                                                            #
                                                            {
                                                                booking.room_number
                                                            }
                                                        </span>
                                                        <span>·</span>
                                                        <span>
                                                            {booking.room_type}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 pl-2">
                                                {getReservationStatusBadge(
                                                    booking.status,
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Payments Feed */}
                        <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
                            <div className="flex items-center justify-between border-b border-border/50 p-4 pb-3">
                                <div>
                                    <h3 className="font-sans text-base font-bold text-foreground">
                                        {t(
                                            'adminDashboard.recentPayments.title',
                                        )}
                                    </h3>
                                    <p className="font-sans text-xs text-muted-foreground">
                                        {t(
                                            'adminDashboard.recentPayments.subtitle',
                                        )}
                                    </p>
                                </div>
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 gap-1 font-sans text-xs text-primary hover:text-primary"
                                >
                                    <Link href={staffPaymentsIndex()}>
                                        {t('common.actions.viewAll')}
                                        <ArrowUpRight className="size-3.5" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="divide-y divide-border/50">
                                {recentPayments.length === 0 ? (
                                    <div className="p-6 text-center font-sans text-sm text-muted-foreground">
                                        {t(
                                            'adminDashboard.recentPayments.noPayments',
                                        )}
                                    </div>
                                ) : (
                                    recentPayments.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="flex items-center justify-between p-3.5 transition-colors hover:bg-muted/30"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                    <CreditCard className="size-4.5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-sans text-sm font-bold text-foreground">
                                                        {payment.guest_name}
                                                    </p>
                                                    <p className="truncate font-sans text-xs text-muted-foreground capitalize">
                                                        {payment.method} ·{' '}
                                                        {payment.paid_at}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <span className="font-sans text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                    +
                                                    {formatCurrency(
                                                        payment.amount,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Admin dashboard', href: adminDashboardIndex() }],
};
