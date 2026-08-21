import { Head, router } from '@inertiajs/react';
import {
    Calendar,
    CalendarCheck,
    Check,
    Clock,
    Home,
    LogIn,
    LogOut,
    Search,
    User,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ReservationController from '@/actions/App/Http/Controllers/Staff/ReservationController';
import Pagination from '@/components/pagination';
import ReservationWalkinDialog from '@/components/reservation-walkin-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import { index as staffReservationsIndex } from '@/routes/staff/reservations';
import type {
    Paginated,
    ReservationGuestSummary,
    RoomOption,
    StaffReservation,
} from '@/types';

type Filters = {
    search: string | null;
    status: string | null;
};

type StatusCounts = {
    all: number;
    pending: number;
    confirmed: number;
    checked_in: number;
    active: number;
    checked_out: number;
    cancelled: number;
};

type Props = {
    reservations: Paginated<StaffReservation>;
    filters: Filters;
    statusCounts?: StatusCounts;
    guests: ReservationGuestSummary[];
    rooms: RoomOption[];
};

export default function StaffReservationsIndex({
    reservations,
    filters,
    statusCounts,
    guests,
    rooms,
}: Props) {
    const { t } = useTranslation();

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'any');

    const applyFilters = (next: Partial<Filters>) => {
        const nextSearch = next.search !== undefined ? next.search : search;
        const nextStatus = next.status !== undefined ? next.status : status;

        router.get(
            staffReservationsIndex().url,
            {
                search: nextSearch || undefined,
                status: nextStatus === 'any' ? undefined : nextStatus,
            },
            {
                preserveState: true,
                replace: true,
                only: ['reservations', 'filters', 'statusCounts'],
            },
        );
    };

    useEffect(() => {
        const timeout = setTimeout(() => applyFilters({ search }), 300);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const runAction = (url: string) => {
        router.patch(url, {}, { preserveScroll: true, only: ['reservations', 'statusCounts'] });
    };

    const getInitials = (name: string) => {
        if (!name) return 'G';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const getStatusBadge = (resStatus: string) => {
        switch (resStatus) {
            case 'confirmed':
                return (
                    <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary font-sans text-xs font-semibold">
                        {t('common.reservationStatus.confirmed')}
                    </Badge>
                );
            case 'checked_in':
            case 'active':
                return (
                    <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-sans text-xs font-semibold gap-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t(`common.reservationStatus.${resStatus}`)}
                    </Badge>
                );
            case 'checked_out':
                return (
                    <Badge variant="outline" className="border-border bg-muted/50 text-muted-foreground font-sans text-xs">
                        {t('common.reservationStatus.checked_out')}
                    </Badge>
                );
            case 'cancelled':
                return (
                    <Badge variant="outline" className="border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-sans text-xs">
                        {t('common.reservationStatus.cancelled')}
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-sans text-xs font-semibold">
                        {t('common.reservationStatus.pending')}
                    </Badge>
                );
        }
    };

    const filterTabs = [
        { id: 'any', label: 'All', count: statusCounts?.all ?? reservations.total },
        { id: 'confirmed', label: t('common.reservationStatus.confirmed'), count: statusCounts?.confirmed },
        { id: 'checked_in', label: t('common.reservationStatus.checked_in'), count: statusCounts?.checked_in },
        { id: 'active', label: t('common.reservationStatus.active'), count: statusCounts?.active },
        { id: 'pending', label: t('common.reservationStatus.pending'), count: statusCounts?.pending },
        { id: 'checked_out', label: t('common.reservationStatus.checked_out'), count: statusCounts?.checked_out },
        { id: 'cancelled', label: t('common.reservationStatus.cancelled'), count: statusCounts?.cancelled },
    ];

    return (
        <>
            <Head title={t('nav.staff.reservations')} />

            <div className="w-full space-y-5 p-4 md:p-6 bg-background">
                {/* 1. Title & Subtitle Alone */}
                <div className="pt-1">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-sans">
                        {t('staff.reservations.pageTitle')}
                    </h1>
                    <p className="text-sm text-muted-foreground font-sans mt-0.5">
                        {t('staff.reservations.subtitle')}
                    </p>
                </div>

                {/* 2. Toolbar: Search + Dropdown on Left, Create Button on Right */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder={t('staff.reservations.searchPlaceholder')}
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                className="pl-9.5 pr-8 h-10 rounded-xl border-border bg-card shadow-2xs font-sans text-sm"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>

                        <Select
                            value={status}
                            onValueChange={(value) => {
                                setStatus(value);
                                applyFilters({ status: value });
                            }}
                        >
                            <SelectTrigger className="w-full sm:w-48 h-10 rounded-xl border-border bg-card shadow-2xs font-sans text-sm">
                                <SelectValue placeholder={t('common.labels.status')} />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border font-sans">
                                <SelectItem value="any">
                                    {t('staff.reservations.anyStatus')} {statusCounts?.all !== undefined ? `(${statusCounts.all})` : ''}
                                </SelectItem>
                                <SelectItem value="confirmed">
                                    {t('common.reservationStatus.confirmed')} {statusCounts?.confirmed !== undefined ? `(${statusCounts.confirmed})` : ''}
                                </SelectItem>
                                <SelectItem value="checked_in">
                                    {t('common.reservationStatus.checked_in')} {statusCounts?.checked_in !== undefined ? `(${statusCounts.checked_in})` : ''}
                                </SelectItem>
                                <SelectItem value="active">
                                    {t('common.reservationStatus.active')} {statusCounts?.active !== undefined ? `(${statusCounts.active})` : ''}
                                </SelectItem>
                                <SelectItem value="pending">
                                    {t('common.reservationStatus.pending')} {statusCounts?.pending !== undefined ? `(${statusCounts.pending})` : ''}
                                </SelectItem>
                                <SelectItem value="checked_out">
                                    {t('common.reservationStatus.checked_out')} {statusCounts?.checked_out !== undefined ? `(${statusCounts.checked_out})` : ''}
                                </SelectItem>
                                <SelectItem value="cancelled">
                                    {t('common.reservationStatus.cancelled')} {statusCounts?.cancelled !== undefined ? `(${statusCounts.cancelled})` : ''}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="shrink-0">
                        <ReservationWalkinDialog guests={guests} rooms={rooms} />
                    </div>
                </div>

                {/* 3. High-End Front-Desk Bookings Table */}
                <div className="rounded-2xl border border-border/80 bg-card shadow-2xs overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50 border-b border-border">
                            <TableRow className="h-13 border-border hover:bg-transparent">
                                <TableHead className="h-13 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground font-sans pl-6">
                                    {t('common.labels.guest')}
                                </TableHead>
                                <TableHead className="h-13 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground font-sans px-6">
                                    {t('common.labels.room')}
                                </TableHead>
                                <TableHead className="h-13 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground font-sans px-4">
                                    {t('common.labels.type')}
                                </TableHead>
                                <TableHead className="h-13 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground font-sans px-4">
                                    {t('staff.reservations.table.dates')}
                                </TableHead>
                                <TableHead className="h-13 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground font-sans px-4">
                                    {t('common.labels.status')}
                                </TableHead>
                                <TableHead className="h-13 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground font-sans text-right pr-6">
                                    {t('common.actions.actions')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-border/60">
                            {reservations.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-12 text-center text-muted-foreground font-sans"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <CalendarCheck className="size-8 text-muted-foreground/50" />
                                            <p className="text-sm font-semibold">{t('staff.reservations.empty')}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reservations.data.map((reservation) => (
                                    <TableRow
                                        key={reservation.id}
                                        className="h-16 transition-colors hover:bg-muted/20"
                                    >
                                        {/* Guest Profile */}
                                        <TableCell className="py-3.5 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs font-sans">
                                                    {getInitials(reservation.guest.full_name)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-bold text-foreground font-sans">
                                                        {reservation.guest.full_name}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground font-sans">
                                                        {reservation.guest.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Room Badge with Padding */}
                                        <TableCell className="px-6 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex h-8 min-w-10 px-2.5 items-center justify-center rounded-xl border border-border/90 bg-background font-bold text-[13px] text-foreground font-sans shadow-2xs">
                                                    #{reservation.room.room_number}
                                                </span>
                                                <span className="text-xs font-medium text-muted-foreground font-sans capitalize">
                                                    {reservation.room.room_type}
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* Type */}
                                        <TableCell className="px-4 py-3.5">
                                            <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-2.5 py-1 text-xs font-medium text-foreground font-sans">
                                                {reservation.reservation_type === 'short_stay' ? (
                                                    <>
                                                        <Calendar className="size-3.5 text-primary" />
                                                        <span>{t('common.reservationType.short_stay')}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Home className="size-3.5 text-purple-600 dark:text-purple-400" />
                                                        <span>{t('common.reservationType.long_stay')}</span>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Dates */}
                                        <TableCell>
                                            <div className="space-y-0.5 font-sans">
                                                <div className="text-xs font-semibold text-foreground">
                                                    {reservation.reservation_type === 'short_stay'
                                                        ? `${reservation.check_in_date} → ${reservation.check_out_date}`
                                                        : `${reservation.start_date} → ${reservation.end_date ?? t('staff.reservations.openEnded')}`}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                    <Clock className="size-3" />
                                                    <span>
                                                        {reservation.reservation_type === 'short_stay'
                                                            ? 'Daily Booking'
                                                            : 'Monthly Lease'}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            {getStatusBadge(reservation.status)}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-right pr-5">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* Confirm Button */}
                                                {reservation.status === 'pending' && (
                                                    <Button
                                                        size="sm"
                                                        className="h-8 gap-1 rounded-xl bg-primary text-primary-foreground font-sans text-xs font-semibold shadow-2xs"
                                                        onClick={() =>
                                                            runAction(
                                                                ReservationController.confirm.url(
                                                                    reservation.id,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <Check className="size-3.5" />
                                                        {t('common.actions.confirm')}
                                                    </Button>
                                                )}

                                                {/* Check In Button */}
                                                {reservation.status === 'confirmed' &&
                                                    reservation.reservation_type === 'short_stay' && (
                                                        <Button
                                                            size="sm"
                                                            className="h-8 gap-1.5 rounded-xl bg-primary text-primary-foreground font-sans text-xs font-semibold shadow-2xs"
                                                            onClick={() =>
                                                                runAction(
                                                                    ReservationController.checkIn.url(
                                                                        reservation.id,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            <LogIn className="size-3.5" />
                                                            {t('staff.reservations.checkIn')}
                                                        </Button>
                                                    )}

                                                {/* Check Out Button */}
                                                {reservation.status === 'checked_in' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 gap-1.5 rounded-xl border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 font-sans text-xs font-semibold"
                                                        onClick={() =>
                                                            runAction(
                                                                ReservationController.checkOut.url(
                                                                    reservation.id,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <LogOut className="size-3.5" />
                                                        {t('staff.reservations.checkOut')}
                                                    </Button>
                                                )}

                                                {/* Cancel Button */}
                                                {['pending', 'confirmed', 'active'].includes(
                                                    reservation.status,
                                                ) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 rounded-xl text-xs text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 font-sans"
                                                        onClick={() =>
                                                            runAction(
                                                                ReservationController.cancel.url(
                                                                    reservation.id,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <X className="size-3.5 mr-1" />
                                                        {t('common.actions.cancel')}
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* 4. Pagination */}
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground font-sans">
                        Showing {reservations.data.length} of {reservations.total} reservations
                    </p>
                    <Pagination meta={reservations} />
                </div>
            </div>
        </>
    );
}

StaffReservationsIndex.layout = {
    breadcrumbs: [{ title: 'Reservations', href: staffReservationsIndex() }],
};
