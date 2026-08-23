import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    BedDouble,
    Calendar,
    CalendarCheck,
    CheckCircle2,
    Clock,
    CreditCard,
    DollarSign,
    FileText,
    Home,
    Hotel,
    LogIn,
    LogOut,
    Plus,
    Sparkles,
    Users,
    Wrench,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import RevenueTrendChart from '@/components/charts/revenue-trend-chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    const [selectedRoomStatusFilter, setSelectedRoomStatusFilter] = useState<string>('all');

    const totalRooms = occupancy?.total_rooms ?? 0;
    const occupiedCount = (occupancy?.short_stay ?? 0) + (occupancy?.long_stay ?? 0);
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

    // Filtered rooms in the Live Room Grid
    const filteredRooms = useMemo(() => {
        if (selectedRoomStatusFilter === 'all') return roomsList;
        return roomsList.filter((room) => room.status === selectedRoomStatusFilter);
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
        switch (status) {
            case 'confirmed':
                return <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary font-sans text-xs font-semibold">Confirmed</Badge>;
            case 'checked_in':
            case 'active':
                return (
                    <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-sans text-xs font-semibold gap-1">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Checked In
                    </Badge>
                );
            case 'checked_out':
            case 'completed':
                return <Badge variant="outline" className="border-border bg-muted/50 text-muted-foreground font-sans text-xs">Checked Out</Badge>;
            case 'cancelled':
                return <Badge variant="outline" className="border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-sans text-xs">Cancelled</Badge>;
            default:
                return <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 font-sans text-xs">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title={t('adminDashboard.title')} />

            <div className="w-full flex-1 space-y-5 p-4 md:p-6 bg-background">
                {/* 1. Glassmorphic Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card/50 p-6 rounded-3xl border border-border/50 shadow-sm backdrop-blur-sm">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-sans">
                            {t('adminDashboard.greeting', {
                                name: String(auth?.user?.name || 'Admin'),
                            })}
                        </h1>
                        <p className="text-sm text-muted-foreground font-sans mt-0.5">
                            {t('adminDashboard.subtitle')}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <Button asChild size="sm" className="gap-2 rounded-xl shadow-2xs font-sans text-sm font-semibold h-10 px-4">
                            <Link href={staffReservationsIndex()}>
                                <Plus className="size-4" />
                                {t('adminDashboard.quickActions.reservations')}
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="gap-2 rounded-xl border-border bg-card hover:bg-accent font-sans text-sm h-10 px-3.5 shadow-2xs">
                            <Link href={adminRoomsIndex()}>
                                <BedDouble className="size-4 text-muted-foreground" />
                                {t('adminDashboard.quickActions.manageRooms')}
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="gap-2 rounded-xl border-border bg-card hover:bg-accent font-sans text-sm h-10 px-3.5 shadow-2xs">
                            <Link href={adminInvoicesIndex()}>
                                <FileText className="size-4 text-muted-foreground" />
                                {t('adminDashboard.quickActions.invoices')}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* 2. Today's Front-Desk Operational Pulse */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                    <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <LogIn className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-muted-foreground font-sans">
                                {t('adminDashboard.operations.todayCheckIns')}
                            </p>
                            <p className="text-xl font-bold tracking-tight text-foreground font-sans">
                                {todayCheckIns} <span className="text-xs font-normal text-muted-foreground">rooms</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                            <LogOut className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-muted-foreground font-sans">
                                {t('adminDashboard.operations.todayCheckOuts')}
                            </p>
                            <p className="text-xl font-bold tracking-tight text-foreground font-sans">
                                {todayCheckOuts} <span className="text-xs font-normal text-muted-foreground">rooms</span>
                            </p>
                        </div>
                    </div>

                    <Link
                        href={staffHousekeepingIndex()}
                        className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-amber-500/40"
                    >
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <Sparkles className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-muted-foreground font-sans">
                                {t('adminDashboard.roomStatus.cleaning')}
                            </p>
                            <p className="text-xl font-bold tracking-tight text-foreground font-sans">
                                {roomStatusCounts.cleaning} <span className="text-xs font-normal text-muted-foreground">dirty</span>
                            </p>
                        </div>
                    </Link>

                    <Link
                        href={staffMaintenanceIndex()}
                        className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-rose-500/40"
                    >
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                            <Wrench className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-muted-foreground font-sans">
                                {t('adminDashboard.stats.openMaintenanceRequests')}
                            </p>
                            <p className="text-xl font-bold tracking-tight text-foreground font-sans">
                                {openMaintenanceCount} <span className="text-xs font-normal text-muted-foreground">pending</span>
                            </p>
                        </div>
                    </Link>
                </div>

                {/* 3. Core Financial & Performance Metric Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Revenue Card */}
                    <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="flex items-center justify-between pb-2">
                            <span className="text-sm font-medium text-muted-foreground font-sans">
                                {t('adminDashboard.stats.revenueThisMonth')}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <DollarSign className="size-4.5" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-sans">
                                {formatCurrency(revenueThisMonth)}
                            </div>
                            <p className="text-xs text-muted-foreground font-sans flex items-center gap-1.5 pt-1">
                                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                                    ● Active
                                </span>
                                {t('adminDashboard.stats.revenueSubtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Occupancy Card */}
                    <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="flex items-center justify-between pb-2">
                            <span className="text-sm font-medium text-muted-foreground font-sans">
                                {t('adminDashboard.stats.occupancyRate')}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <BedDouble className="size-4.5" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-sans">
                                    {occupancyRate}%
                                </span>
                                <span className="text-xs font-semibold text-muted-foreground font-sans">
                                    ({occupiedCount} / {totalRooms} rooms)
                                </span>
                            </div>
                            <div className="flex items-center gap-2 pt-1.5">
                                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all duration-500"
                                        style={{ width: `${occupancyRate}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Unpaid Invoices */}
                    <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="flex items-center justify-between pb-2">
                            <span className="text-sm font-medium text-muted-foreground font-sans">
                                {t('adminDashboard.stats.outstandingInvoices')}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <FileText className="size-4.5" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-sans">
                                    {outstandingInvoicesCount}
                                </span>
                                {outstandingInvoicesCount > 0 && (
                                    <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-sans text-xs">
                                        Pending
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground font-sans pt-1">
                                {t('adminDashboard.stats.invoicesSubtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Available Inventory */}
                    <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="flex items-center justify-between pb-2">
                            <span className="text-sm font-medium text-muted-foreground font-sans">
                                {t('adminDashboard.roomStatus.available')}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="size-4.5" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-sans">
                                {roomStatusCounts.available} <span className="text-sm font-normal text-muted-foreground font-sans">Ready</span>
                            </div>
                            <p className="text-xs text-muted-foreground font-sans pt-1">
                                Clean and ready for walk-ins
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4. Live Room Matrix Rack (The Heartbeat of the Guest House) */}
                <div className="rounded-3xl border border-border/50 bg-card shadow-sm overflow-hidden">
                    <div className="flex flex-col gap-3 p-4 sm:p-5 pb-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60">
                        <div>
                            <div className="flex items-center gap-2">
                                <Hotel className="size-5 text-primary" />
                                <h2 className="text-base font-bold font-sans text-foreground">
                                    {t('adminDashboard.operations.roomMatrix')}
                                </h2>
                            </div>
                            <p className="font-sans text-xs text-muted-foreground pt-0.5">
                                Real-time floor status, occupancy, and room inventory rack
                            </p>
                        </div>

                        {/* Filter tabs */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            {[
                                { id: 'all', label: `All (${roomsList.length})` },
                                { id: 'available', label: `${t('adminDashboard.roomStatus.available')} (${roomStatusCounts.available})` },
                                { id: 'occupied', label: `${t('adminDashboard.roomStatus.occupied')} (${roomStatusCounts.occupied})` },
                                { id: 'cleaning', label: `${t('adminDashboard.roomStatus.cleaning')} (${roomStatusCounts.cleaning})` },
                                { id: 'maintenance', label: `${t('adminDashboard.roomStatus.maintenance')} (${roomStatusCounts.maintenance})` },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSelectedRoomStatusFilter(tab.id)}
                                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold font-sans transition-all cursor-pointer ${
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
                            <div className="py-8 text-center text-sm text-muted-foreground font-sans">
                                No rooms match the selected status filter.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                                {filteredRooms.map((room) => {
                                    const statusInfo = getRoomStatusColor(room.status);

                                    return (
                                        <Link
                                            key={room.id}
                                            href={adminRoomsIndex()}
                                            className="group relative flex flex-col justify-between rounded-2xl border border-border/50 bg-background p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-bold tracking-tight text-foreground group-hover:text-primary font-sans">
                                                    #{room.room_number}
                                                </span>
                                                <span className={`size-2 rounded-full ${statusInfo.dot}`} />
                                            </div>

                                            <div className="mt-2 space-y-1.5">
                                                <div className="truncate text-xs font-medium text-muted-foreground capitalize font-sans">
                                                    {room.room_type}
                                                </div>
                                                <div className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold border ${statusInfo.bg} font-sans`}>
                                                    {statusInfo.label}
                                                </div>
                                            </div>

                                            <div className="mt-2.5 pt-2 border-t border-border/40 text-[11.5px] font-semibold text-foreground flex items-center justify-between font-sans">
                                                <span>${room.price_per_night}</span>
                                                <span className="text-[10px] font-normal text-muted-foreground">/ night</span>
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
                        <div className="rounded-3xl border border-border/50 bg-card shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between p-4 pb-3 border-b border-border/50">
                                <div>
                                    <h3 className="text-base font-bold font-sans text-foreground">
                                        {t('adminDashboard.recentBookings.title')}
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-sans">
                                        Latest reservation activity
                                    </p>
                                </div>
                                <Button asChild variant="ghost" size="sm" className="h-8 gap-1 text-xs text-primary hover:text-primary font-sans">
                                    <Link href={staffReservationsIndex()}>
                                        View All
                                        <ArrowUpRight className="size-3.5" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="divide-y divide-border/50">
                                {recentReservations.length === 0 ? (
                                    <div className="p-6 text-center text-sm text-muted-foreground font-sans">
                                        {t('adminDashboard.recentBookings.noBookings')}
                                    </div>
                                ) : (
                                    recentReservations.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center justify-between p-3.5 transition-colors hover:bg-muted/30"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs font-sans">
                                                    {getInitials(booking.guest_name)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-bold text-foreground font-sans">
                                                        {booking.guest_name}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground font-sans flex items-center gap-1.5">
                                                        <span className="font-semibold text-foreground">#{booking.room_number}</span>
                                                        <span>·</span>
                                                        <span>{booking.room_type}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 pl-2">
                                                {getReservationStatusBadge(booking.status)}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Payments Feed */}
                        <div className="rounded-3xl border border-border/50 bg-card shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between p-4 pb-3 border-b border-border/50">
                                <div>
                                    <h3 className="text-base font-bold font-sans text-foreground">
                                        {t('adminDashboard.recentPayments.title')}
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-sans">
                                        Confirmed revenue receipts
                                    </p>
                                </div>
                                <Button asChild variant="ghost" size="sm" className="h-8 gap-1 text-xs text-primary hover:text-primary font-sans">
                                    <Link href={staffPaymentsIndex()}>
                                        View All
                                        <ArrowUpRight className="size-3.5" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="divide-y divide-border/50">
                                {recentPayments.length === 0 ? (
                                    <div className="p-6 text-center text-sm text-muted-foreground font-sans">
                                        {t('adminDashboard.recentPayments.noPayments')}
                                    </div>
                                ) : (
                                    recentPayments.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="flex items-center justify-between p-3.5 transition-colors hover:bg-muted/30"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                    <CreditCard className="size-4.5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-bold text-foreground font-sans">
                                                        {payment.guest_name}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground font-sans capitalize">
                                                        {payment.method} · {payment.paid_at}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <span className="font-sans font-bold text-sm text-emerald-600 dark:text-emerald-400">
                                                    +{formatCurrency(payment.amount)}
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
