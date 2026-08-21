import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    BedDouble,
    Calendar,
    CheckCircle2,
    Clock,
    CreditCard,
    DollarSign,
    FileText,
    Receipt,
    Sparkles,
    TrendingUp,
    Users,
    Wrench,
} from 'lucide-react';
import { OccupancyBreakdownChart } from '@/components/charts/occupancy-breakdown-chart';
import { RevenueTrendChart } from '@/components/charts/revenue-trend-chart';
import RoomCreateDialog from '@/components/room-create-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { index as adminDashboardIndex } from '@/routes/admin/dashboard';
import { index as adminInvoicesIndex } from '@/routes/admin/invoices';
import { index as adminRoomsIndex } from '@/routes/admin/rooms';
import { index as staffMaintenanceIndex } from '@/routes/staff/maintenance';
import { index as staffPaymentsIndex } from '@/routes/staff/payments';
import { index as staffReservationsIndex } from '@/routes/staff/reservations';
import type { AdminDashboardData } from '@/types';

type Props = AdminDashboardData;

export default function AdminDashboardIndex({
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
    recentReservations = [],
    recentPayments = [],
}: Props) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const userName = auth.user?.full_name?.split(' ')[0] || 'Admin';

    const availableRooms =
        occupancy.total_rooms - occupancy.short_stay - occupancy.long_stay;
    const occupiedRooms = occupancy.short_stay + occupancy.long_stay;
    const occupancyRate =
        occupancy.total_rooms > 0
            ? Math.round((occupiedRooms / occupancy.total_rooms) * 100)
            : 0;

    return (
        <>
            <Head title={t('adminDashboard.title')} />

            <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Clean Hero Welcome Banner */}
                <div className="relative rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                    <Sparkles className="size-3.5" />
                                    Hour Guest House PMS
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans">
                                {t('adminDashboard.greeting', { name: userName })}
                            </h1>
                            <p className="text-sm text-muted-foreground font-sans">
                                {t('adminDashboard.subtitle')}
                            </p>
                        </div>

                        {/* Fast Action Buttons in Banner */}
                        <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
                            <RoomCreateDialog />
                            <Button asChild variant="outline" size="sm" className="rounded-xl font-sans h-9">
                                <Link href={staffReservationsIndex().url} className="flex items-center gap-1.5">
                                    <Calendar className="size-4 text-muted-foreground" />
                                    <span>{t('adminDashboard.quickActions.reservations')}</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm" className="rounded-xl font-sans h-9">
                                <Link href={adminInvoicesIndex().url} className="flex items-center gap-1.5">
                                    <Receipt className="size-4 text-muted-foreground" />
                                    <span>{t('adminDashboard.quickActions.invoices')}</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 4 Premium Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Stat 1: Monthly Revenue */}
                    <Card className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-200 hover:border-emerald-500/40 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                                {t('adminDashboard.stats.revenueThisMonth')}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-transform duration-200 group-hover:scale-110 dark:text-emerald-400">
                                <DollarSign className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans">
                                ${revenueThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
                                <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                                    <TrendingUp className="size-3" />
                                    Active
                                </span>
                                <span>· {t('adminDashboard.stats.revenueSubtitle')}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Stat 2: Total Rooms & Occupancy */}
                    <Link href={adminRoomsIndex().url} className="block group">
                        <Card className="h-full relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-200 hover:border-blue-500/40 hover:shadow-md cursor-pointer">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                                    {t('adminDashboard.stats.totalRooms')}
                                </span>
                                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 transition-transform duration-200 group-hover:scale-110 dark:text-blue-400">
                                    <BedDouble className="size-5" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans">
                                        {occupancy.total_rooms}
                                    </span>
                                    <Badge variant="secondary" className="font-semibold text-xs bg-blue-500/10 text-blue-700 dark:text-blue-300">
                                        {occupancyRate}% Occupied
                                    </Badge>
                                </div>
                                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground font-sans">
                                    <span>{availableRooms} {t('adminDashboard.roomStatus.available').toLowerCase()} · {occupiedRooms} in use</span>
                                    <ArrowUpRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                                </div>
                            </div>
                        </Card>
                    </Link>

                    {/* Stat 3: Outstanding Invoices */}
                    <Link href={adminInvoicesIndex().url} className="block group">
                        <Card className="h-full relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-200 hover:border-amber-500/40 hover:shadow-md cursor-pointer">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                                    {t('adminDashboard.stats.outstandingInvoices')}
                                </span>
                                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-transform duration-200 group-hover:scale-110 dark:text-amber-400">
                                    <Receipt className="size-5" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans">
                                        {outstandingInvoicesCount}
                                    </span>
                                    {outstandingInvoicesCount > 0 && (
                                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                                            Pending
                                        </span>
                                    )}
                                </div>
                                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground font-sans">
                                    <span>{t('adminDashboard.stats.invoicesSubtitle')}</span>
                                    <ArrowUpRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500" />
                                </div>
                            </div>
                        </Card>
                    </Link>

                    {/* Stat 4: Maintenance Issues */}
                    <Link href={staffMaintenanceIndex().url} className="block group">
                        <Card className="h-full relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-200 hover:border-rose-500/40 hover:shadow-md cursor-pointer">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                                    {t('adminDashboard.stats.openMaintenanceRequests')}
                                </span>
                                <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 transition-transform duration-200 group-hover:scale-110 dark:text-rose-400">
                                    <Wrench className="size-5" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans">
                                        {openMaintenanceCount}
                                    </span>
                                    {openMaintenanceCount > 0 && (
                                        <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                                            Action needed
                                        </span>
                                    )}
                                </div>
                                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground font-sans">
                                    <span>{t('adminDashboard.stats.maintenanceSubtitle')}</span>
                                    <ArrowUpRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-rose-500" />
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>

                {/* Real-time Room Status Bar */}
                <Card className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3">
                        <div className="flex items-center gap-2">
                            <BedDouble className="size-4.5 text-primary" />
                            <h2 className="text-sm font-bold tracking-tight text-foreground font-sans">
                                {t('adminDashboard.roomStatus.title')}
                            </h2>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-sans self-start sm:self-auto">
                            <Link href={adminRoomsIndex().url} className="flex items-center gap-1 text-primary hover:underline">
                                <span>{t('adminDashboard.quickActions.manageRooms')}</span>
                                <ArrowUpRight className="size-3.5" />
                            </Link>
                        </Button>
                    </div>

                    {/* Multi-segment Progress Bar */}
                    <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-muted/60 p-0.5">
                        {roomStatusCounts.available > 0 && (
                            <div
                                style={{ width: `${(roomStatusCounts.available / (occupancy.total_rooms || 1)) * 100}%` }}
                                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                title={`Available: ${roomStatusCounts.available}`}
                            />
                        )}
                        {roomStatusCounts.occupied > 0 && (
                            <div
                                style={{ width: `${(roomStatusCounts.occupied / (occupancy.total_rooms || 1)) * 100}%` }}
                                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                title={`Occupied: ${roomStatusCounts.occupied}`}
                            />
                        )}
                        {roomStatusCounts.reserved > 0 && (
                            <div
                                style={{ width: `${(roomStatusCounts.reserved / (occupancy.total_rooms || 1)) * 100}%` }}
                                className="h-full rounded-full bg-purple-500 transition-all duration-500"
                                title={`Reserved: ${roomStatusCounts.reserved}`}
                            />
                        )}
                        {roomStatusCounts.cleaning > 0 && (
                            <div
                                style={{ width: `${(roomStatusCounts.cleaning / (occupancy.total_rooms || 1)) * 100}%` }}
                                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                                title={`Cleaning: ${roomStatusCounts.cleaning}`}
                            />
                        )}
                        {roomStatusCounts.maintenance > 0 && (
                            <div
                                style={{ width: `${(roomStatusCounts.maintenance / (occupancy.total_rooms || 1)) * 100}%` }}
                                className="h-full rounded-full bg-rose-500 transition-all duration-500"
                                title={`Maintenance: ${roomStatusCounts.maintenance}`}
                            />
                        )}
                    </div>

                    {/* Status Pill Badges */}
                    <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-sans">
                        <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full bg-emerald-500" />
                            <span className="text-muted-foreground">{t('adminDashboard.roomStatus.available')}:</span>
                            <span className="font-bold text-foreground">{roomStatusCounts.available}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full bg-blue-500" />
                            <span className="text-muted-foreground">{t('adminDashboard.roomStatus.occupied')}:</span>
                            <span className="font-bold text-foreground">{roomStatusCounts.occupied}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full bg-purple-500" />
                            <span className="text-muted-foreground">{t('adminDashboard.roomStatus.reserved')}:</span>
                            <span className="font-bold text-foreground">{roomStatusCounts.reserved}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full bg-amber-500" />
                            <span className="text-muted-foreground">{t('adminDashboard.roomStatus.cleaning')}:</span>
                            <span className="font-bold text-foreground">{roomStatusCounts.cleaning}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full bg-rose-500" />
                            <span className="text-muted-foreground">{t('adminDashboard.roomStatus.maintenance')}:</span>
                            <span className="font-bold text-foreground">{roomStatusCounts.maintenance}</span>
                        </div>
                    </div>
                </Card>

                {/* Charts Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <RevenueTrendChart data={revenueTrend} />
                    </div>
                    <div>
                        <OccupancyBreakdownChart
                            shortStay={occupancy.short_stay}
                            longStay={occupancy.long_stay}
                            available={availableRooms}
                        />
                    </div>
                </div>

                {/* Operational Section: Recent Bookings & Recent Payments */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Bookings */}
                    <Card className="rounded-2xl border border-border/70 bg-card shadow-sm flex flex-col justify-between">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base font-bold tracking-tight font-sans">
                                    {t('adminDashboard.recentBookings.title')}
                                </CardTitle>
                                <CardDescription className="text-xs text-muted-foreground font-sans">
                                    Latest reservation records
                                </CardDescription>
                            </div>
                            <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-sans">
                                <Link href={staffReservationsIndex().url} className="flex items-center gap-1 text-primary hover:underline">
                                    <span>{t('adminDashboard.recentBookings.viewAll')}</span>
                                    <ArrowUpRight className="size-3.5" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {recentReservations.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground font-sans">
                                    {t('adminDashboard.recentBookings.noBookings')}
                                </div>
                            ) : (
                                <div className="divide-y divide-border/60">
                                    {recentReservations.map((res) => (
                                        <div key={res.id} className="flex items-center justify-between py-3 font-sans">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                                                    {res.room_number}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {res.guest_name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {res.room_type} · {res.check_in_date || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className={`text-[11px] font-medium capitalize ${
                                                    res.status === 'checked_in' || res.status === 'active'
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                        : res.status === 'confirmed'
                                                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                        : 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                {res.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Payments */}
                    <Card className="rounded-2xl border border-border/70 bg-card shadow-sm flex flex-col justify-between">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base font-bold tracking-tight font-sans">
                                    {t('adminDashboard.recentPayments.title')}
                                </CardTitle>
                                <CardDescription className="text-xs text-muted-foreground font-sans">
                                    Confirmed transactions
                                </CardDescription>
                            </div>
                            <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-sans">
                                <Link href={staffPaymentsIndex().url} className="flex items-center gap-1 text-primary hover:underline">
                                    <span>{t('adminDashboard.recentPayments.viewAll')}</span>
                                    <ArrowUpRight className="size-3.5" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {recentPayments.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground font-sans">
                                    {t('adminDashboard.recentPayments.noPayments')}
                                </div>
                            ) : (
                                <div className="divide-y divide-border/60">
                                    {recentPayments.map((payment) => (
                                        <div key={payment.id} className="flex items-center justify-between py-3 font-sans">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                    <CreditCard className="size-4.5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {payment.guest_name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground capitalize">
                                                        {payment.method.replace('_', ' ')} · {payment.paid_at}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                +${payment.amount.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

AdminDashboardIndex.layout = {
    breadcrumbs: [{ title: 'Admin dashboard', href: adminDashboardIndex() }],
};
