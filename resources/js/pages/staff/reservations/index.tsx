import { Head, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    CalendarCheck,
    CalendarDays,
    Check,
    Clock,
    Eye,
    Home,
    LayoutList,
    LogIn,
    LogOut,
    Printer,
    Repeat2,
    Search,
    StickyNote,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReservationController from '@/actions/App/Http/Controllers/Staff/ReservationController';
import Pagination from '@/components/pagination';
import {
    ReservationStatusBadge,
    PaymentStatusBadge,
} from '@/components/reservation-badges';
import ReservationCheckinDialog from '@/components/reservation-checkin-dialog';
import ReservationCheckoutInvoiceDialog from '@/components/reservation-checkout-invoice-dialog';
import type { CheckoutInvoiceSummary } from '@/components/reservation-checkout-invoice-dialog';
import ReservationDetailsDrawer from '@/components/reservation-details-drawer';
import ReservationPrintSlip from '@/components/reservation-print-slip';
import ReservationTimelineView from '@/components/reservation-timeline-view';
import ReservationTodayPanel from '@/components/reservation-today-panel';
import ReservationWalkinDialog from '@/components/reservation-walkin-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { usePendingAction } from '@/hooks/use-pending-action';
import { useTranslation } from '@/hooks/use-translation';
import { cn, getInitials } from '@/lib/utils';
import { index as staffReservationsIndex } from '@/routes/staff/reservations';
import type { Paginated, RoomOption } from '@/types';
import type {
    ReservationGuestSummary,
    StaffReservation,
    TimelineRoom,
} from '@/types/reservation';

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
    timelineRooms?: TimelineRoom[];
    todaysArrivals?: StaffReservation[];
    todaysDepartures?: StaffReservation[];
    guests: ReservationGuestSummary[];
    rooms: RoomOption[];
    available_services: { id: string; name: string; price: number }[];
};

export default function StaffReservationsIndex({
    reservations,
    filters,
    statusCounts,
    timelineRooms = [],
    todaysArrivals = [],
    todaysDepartures = [],
    guests,
    rooms,
    available_services,
}: Props) {
    const { t } = useTranslation();

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'any');
    const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');

    // Dialog & Drawer States
    const [selectedReservation, setSelectedReservation] =
        useState<StaffReservation | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isCheckinOpen, setIsCheckinOpen] = useState(false);
    const [isPrintSlipOpen, setIsPrintSlipOpen] = useState(false);
    const [checkoutInvoice, setCheckoutInvoice] =
        useState<CheckoutInvoiceSummary | null>(null);
    const [isCheckoutInvoiceOpen, setIsCheckoutInvoiceOpen] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);

    // Dim the list while a search/status filter reload is in flight
    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            if (event.detail.visit.only?.includes('reservations')) {
                setIsFiltering(true);
            }
        });
        const removeFinish = router.on('finish', (event) => {
            if (event.detail.visit.only?.includes('reservations')) {
                setIsFiltering(false);
            }
        });

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    // Listen for checkout invoice flash on every navigation
    const { props } = usePage<{
        flash?: { checkoutInvoice?: CheckoutInvoiceSummary | null };
    }>();
    useEffect(() => {
        const inv = props.flash?.checkoutInvoice;

        if (inv) {
            setCheckoutInvoice(inv);
            setIsCheckoutInvoiceOpen(true);
        }
    }, [props.flash?.checkoutInvoice]);

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
                only: [
                    'reservations',
                    'filters',
                    'statusCounts',
                    'timelineRooms',
                    'todaysArrivals',
                    'todaysDepartures',
                ],
            },
        );
    };

    const debouncedSearch = useDebouncedValue(search, 300);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        applyFilters({ search: debouncedSearch });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const { isPending, withPending } = usePendingAction();

    const runAction = (id: string, url: string) => {
        router.patch(
            url,
            {},
            withPending(id, {
                preserveScroll: true,
                only: [
                    'reservations',
                    'statusCounts',
                    'timelineRooms',
                    'todaysArrivals',
                    'todaysDepartures',
                ],
            }),
        );
    };

    return (
        <>
            <Head title={t('nav.staff.reservations')} />

            <div className="w-full space-y-5 bg-background p-4 md:p-6">
                {/* 1. Header & Pulse KPI Cards */}
                <div className="space-y-4">
                    <div className="pt-1">
                        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            {t('staff.reservations.pageTitle')}
                        </h1>
                        <p className="mt-0.5 font-sans text-sm text-muted-foreground">
                            {t('staff.reservations.subtitle')}
                        </p>
                    </div>

                    {/* Pulse KPI Metric Cards */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <LayoutList className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {statusCounts?.all || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('staff.reservations.anyStatus')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-warning/10 text-amber-600 dark:text-amber-400">
                                <Clock className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {statusCounts?.pending || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('common.reservationStatus.pending')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-emerald-600 dark:text-emerald-400">
                                <Home className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {(statusCounts?.checked_in || 0) +
                                        (statusCounts?.active || 0)}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('common.reservationStatus.active')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-rose-600 dark:text-rose-400">
                                <LogOut className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {statusCounts?.checked_out || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('common.reservationStatus.checked_out')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1b. Today's Arrivals & Departures */}
                <ReservationTodayPanel
                    arrivals={todaysArrivals}
                    departures={todaysDepartures}
                    onSelect={(res) => {
                        setSelectedReservation(res);
                        setIsDetailsOpen(true);
                    }}
                />

                {/* 2. Glassmorphic Toolbar: Search + Dropdown on Left, View Toggle & Create Button on Right */}
                <div className="flex flex-col items-stretch justify-between gap-3 rounded-3xl border border-border/50 bg-card/60 p-3 shadow-sm backdrop-blur-md sm:flex-row sm:items-center">
                    {/* Left: Search input & Status select */}
                    <div className="flex max-w-xl flex-1 flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={t(
                                    'staff.reservations.searchPlaceholder',
                                )}
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                className="h-10 rounded-2xl border-border bg-background pr-8 pl-9.5 font-sans text-sm shadow-2xs"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
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
                            <SelectTrigger className="h-10 w-full rounded-2xl border-border bg-background font-sans text-sm shadow-2xs sm:w-48">
                                <SelectValue
                                    placeholder={t('common.labels.status')}
                                />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border font-sans">
                                <SelectItem value="any">
                                    {t('staff.reservations.anyStatus')}{' '}
                                    {statusCounts?.all !== undefined
                                        ? `(${statusCounts.all})`
                                        : ''}
                                </SelectItem>
                                <SelectItem value="confirmed">
                                    {t('common.reservationStatus.confirmed')}{' '}
                                    {statusCounts?.confirmed !== undefined
                                        ? `(${statusCounts.confirmed})`
                                        : ''}
                                </SelectItem>
                                <SelectItem value="checked_in">
                                    {t('common.reservationStatus.checked_in')}{' '}
                                    {statusCounts?.checked_in !== undefined
                                        ? `(${statusCounts.checked_in})`
                                        : ''}
                                </SelectItem>
                                <SelectItem value="active">
                                    {t('common.reservationStatus.active')}{' '}
                                    {statusCounts?.active !== undefined
                                        ? `(${statusCounts.active})`
                                        : ''}
                                </SelectItem>
                                <SelectItem value="pending">
                                    {t('common.reservationStatus.pending')}{' '}
                                    {statusCounts?.pending !== undefined
                                        ? `(${statusCounts.pending})`
                                        : ''}
                                </SelectItem>
                                <SelectItem value="checked_out">
                                    {t('common.reservationStatus.checked_out')}{' '}
                                    {statusCounts?.checked_out !== undefined
                                        ? `(${statusCounts.checked_out})`
                                        : ''}
                                </SelectItem>
                                <SelectItem value="cancelled">
                                    {t('common.reservationStatus.cancelled')}{' '}
                                    {statusCounts?.cancelled !== undefined
                                        ? `(${statusCounts.cancelled})`
                                        : ''}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Right: View Switcher (Table vs Timeline) + Create Button */}
                    <div className="flex items-center gap-2.5">
                        {/* View Switcher Toggle */}
                        <div className="flex h-10 items-center gap-1 rounded-2xl border border-border bg-background p-1 shadow-2xs">
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 font-sans text-xs font-semibold transition-all ${
                                    viewMode === 'table'
                                        ? 'bg-primary text-primary-foreground shadow-2xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                                title={t('staff.reservations.viewMode.table')}
                            >
                                <LayoutList className="size-3.5" />
                                <span className="hidden md:inline">
                                    {t('staff.reservations.viewMode.table')}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('timeline')}
                                className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 font-sans text-xs font-semibold transition-all ${
                                    viewMode === 'timeline'
                                        ? 'bg-primary text-primary-foreground shadow-2xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                                title={t(
                                    'staff.reservations.viewMode.timeline',
                                )}
                            >
                                <CalendarDays className="size-3.5" />
                                <span className="hidden md:inline">
                                    {t('staff.reservations.viewMode.timeline')}
                                </span>
                            </button>
                        </div>

                        {/* Create Walk-in / Booking Trigger */}
                        <ReservationWalkinDialog
                            guests={guests}
                            rooms={rooms}
                        />
                    </div>
                </div>

                {/* 3. Main Content: Table View OR Timeline Grid */}
                <div
                    className={cn(
                        'transition-opacity duration-200',
                        isFiltering && 'pointer-events-none opacity-50',
                    )}
                >
                    {viewMode === 'timeline' ? (
                        <ReservationTimelineView
                            rooms={timelineRooms}
                            reservations={reservations.data}
                            onSelectReservation={(res) => {
                                setSelectedReservation(res);
                                setIsDetailsOpen(true);
                            }}
                        />
                    ) : (
                        <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-md">
                            <Table>
                                <TableHeader className="border-b border-border bg-muted/50">
                                    <TableRow className="h-13 border-border hover:bg-transparent">
                                        <TableHead className="h-13 py-4 pl-6 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            {t('common.labels.guest')}
                                        </TableHead>
                                        <TableHead className="h-13 px-6 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            {t('common.labels.room')}
                                        </TableHead>
                                        <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            {t('common.labels.type')}
                                        </TableHead>
                                        <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            {t(
                                                'staff.reservations.table.dates',
                                            )}
                                        </TableHead>
                                        <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            {t('common.labels.status')}
                                        </TableHead>
                                        <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            {t(
                                                'staff.reservations.table.payment',
                                            )}
                                        </TableHead>
                                        <TableHead className="h-13 py-4 pr-6 text-right font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            {t('common.actions.actions')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-border/60">
                                    {reservations.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-12 text-center font-sans text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
                                                        <CalendarCheck className="size-5 text-muted-foreground/60" />
                                                    </div>
                                                    <p className="text-sm font-semibold">
                                                        {t(
                                                            'staff.reservations.empty',
                                                        )}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        reservations.data.map((reservation) => (
                                            <TableRow
                                                key={reservation.id}
                                                className="group h-16 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/5 hover:shadow-sm"
                                                onClick={() => {
                                                    setSelectedReservation(
                                                        reservation,
                                                    );
                                                    setIsDetailsOpen(true);
                                                }}
                                            >
                                                {/* Guest Profile */}
                                                <TableCell className="py-3.5 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="size-9.5 rounded-xl">
                                                            <AvatarFallback className="rounded-xl bg-primary/10 font-sans text-xs font-bold text-primary">
                                                                {getInitials(
                                                                    reservation
                                                                        .guest
                                                                        .full_name,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <p className="flex items-center gap-1.5 truncate font-sans text-sm font-bold text-foreground">
                                                                <span className="truncate">
                                                                    {
                                                                        reservation
                                                                            .guest
                                                                            .full_name
                                                                    }
                                                                </span>
                                                                {reservation.notes && (
                                                                    <span
                                                                        title={t(
                                                                            'staff.reservations.table.hasNotes',
                                                                        )}
                                                                    >
                                                                        <StickyNote className="size-3 shrink-0 text-amber-500" />
                                                                    </span>
                                                                )}
                                                                {(reservation
                                                                    .guest
                                                                    .completed_stays_count ??
                                                                    0) > 1 && (
                                                                    <span
                                                                        title={t(
                                                                            'staff.reservations.table.returningGuest',
                                                                            {
                                                                                count: reservation
                                                                                    .guest
                                                                                    .completed_stays_count!,
                                                                            },
                                                                        )}
                                                                    >
                                                                        <Repeat2 className="size-3 shrink-0 text-primary" />
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <p className="truncate font-sans text-xs text-muted-foreground">
                                                                {
                                                                    reservation
                                                                        .guest
                                                                        .email
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* Room Badge with Padding */}
                                                <TableCell className="px-6 py-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="flex h-8 min-w-10 items-center justify-center rounded-xl border border-border/90 bg-background px-2.5 font-sans text-[13px] font-bold text-foreground shadow-2xs">
                                                            #
                                                            {
                                                                reservation.room
                                                                    .room_number
                                                            }
                                                        </span>
                                                        <span className="font-sans text-xs font-medium text-muted-foreground capitalize">
                                                            {
                                                                reservation.room
                                                                    .room_type
                                                            }
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                {/* Type */}
                                                <TableCell className="px-4 py-3.5">
                                                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-2.5 py-1 font-sans text-xs font-medium text-foreground">
                                                        {reservation.reservation_type ===
                                                        'short_stay' ? (
                                                            <>
                                                                <Calendar className="size-3.5 text-primary" />
                                                                <span>
                                                                    {t(
                                                                        'common.reservationType.short_stay',
                                                                    )}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Home className="size-3.5 text-purple-600 dark:text-purple-400" />
                                                                <span>
                                                                    {t(
                                                                        'common.reservationType.long_stay',
                                                                    )}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                {/* Dates */}
                                                <TableCell className="px-4 py-3.5">
                                                    <div className="space-y-0.5 font-sans">
                                                        <div className="text-xs font-semibold text-foreground">
                                                            {reservation.reservation_type ===
                                                            'short_stay'
                                                                ? `${reservation.check_in_date} → ${reservation.check_out_date}`
                                                                : `${reservation.start_date} → ${reservation.end_date ?? t('staff.reservations.openEnded')}`}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                            <Clock className="size-3" />
                                                            <span>
                                                                {t(
                                                                    `staff.reservations.billingCadence.${reservation.reservation_type}`,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell className="px-4 py-3.5">
                                                    <ReservationStatusBadge
                                                        status={
                                                            reservation.status
                                                        }
                                                    />
                                                </TableCell>

                                                {/* Payment Status Pill */}
                                                <TableCell className="px-4 py-3.5">
                                                    <PaymentStatusBadge
                                                        status={
                                                            reservation
                                                                .latest_invoice
                                                                ?.status
                                                        }
                                                    />
                                                </TableCell>

                                                {/* Action Buttons */}
                                                <TableCell
                                                    className="pr-6 text-right"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* Print Slip Icon Button */}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="size-8 rounded-full p-0 font-sans text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            title={t(
                                                                'staff.reservations.printSlip.title',
                                                            )}
                                                            onClick={() => {
                                                                setSelectedReservation(
                                                                    reservation,
                                                                );
                                                                setIsPrintSlipOpen(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <Printer className="size-4" />
                                                        </Button>

                                                        {/* Confirm Button */}
                                                        {reservation.status ===
                                                            'pending' && (
                                                            <Button
                                                                size="sm"
                                                                className="h-8 gap-1 rounded-full bg-primary font-sans text-xs font-semibold text-primary-foreground shadow-2xs transition-transform hover:scale-105"
                                                                disabled={isPending(
                                                                    reservation.id,
                                                                )}
                                                                onClick={() =>
                                                                    runAction(
                                                                        reservation.id,
                                                                        ReservationController.confirm.url(
                                                                            reservation.id,
                                                                        ),
                                                                    )
                                                                }
                                                            >
                                                                {isPending(
                                                                    reservation.id,
                                                                ) ? (
                                                                    <Spinner className="size-3.5" />
                                                                ) : (
                                                                    <Check className="size-3.5" />
                                                                )}
                                                                {t(
                                                                    'common.actions.confirm',
                                                                )}
                                                            </Button>
                                                        )}

                                                        {/* Check In Button (Opens Modal) */}
                                                        {reservation.status ===
                                                            'confirmed' &&
                                                            reservation.reservation_type ===
                                                                'short_stay' && (
                                                                <Button
                                                                    size="sm"
                                                                    className="h-8 gap-1.5 rounded-full bg-primary font-sans text-xs font-semibold text-primary-foreground shadow-2xs transition-transform hover:scale-105"
                                                                    onClick={() => {
                                                                        setSelectedReservation(
                                                                            reservation,
                                                                        );
                                                                        setIsCheckinOpen(
                                                                            true,
                                                                        );
                                                                    }}
                                                                >
                                                                    <LogIn className="size-3.5" />
                                                                    {t(
                                                                        'staff.reservations.checkIn',
                                                                    )}
                                                                </Button>
                                                            )}

                                                        {/* Check Out Button */}
                                                        {reservation.status ===
                                                            'checked_in' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 gap-1.5 rounded-full border-success/40 bg-success/10 font-sans text-xs font-semibold text-emerald-700 transition-transform hover:scale-105 hover:bg-success/20 dark:text-emerald-300"
                                                                disabled={isPending(
                                                                    reservation.id,
                                                                )}
                                                                onClick={() =>
                                                                    runAction(
                                                                        reservation.id,
                                                                        ReservationController.checkOut.url(
                                                                            reservation.id,
                                                                        ),
                                                                    )
                                                                }
                                                            >
                                                                {isPending(
                                                                    reservation.id,
                                                                ) ? (
                                                                    <Spinner className="size-3.5" />
                                                                ) : (
                                                                    <LogOut className="size-3.5" />
                                                                )}
                                                                {t(
                                                                    'staff.reservations.checkOut',
                                                                )}
                                                            </Button>
                                                        )}

                                                        {/* Cancel Button */}
                                                        {[
                                                            'pending',
                                                            'confirmed',
                                                            'active',
                                                        ].includes(
                                                            reservation.status,
                                                        ) && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 rounded-full font-sans text-xs text-muted-foreground transition-transform hover:scale-105 hover:bg-danger/10 hover:text-rose-600"
                                                                disabled={isPending(
                                                                    reservation.id,
                                                                )}
                                                                onClick={() =>
                                                                    runAction(
                                                                        reservation.id,
                                                                        ReservationController.cancel.url(
                                                                            reservation.id,
                                                                        ),
                                                                    )
                                                                }
                                                            >
                                                                {isPending(
                                                                    reservation.id,
                                                                ) ? (
                                                                    <Spinner className="size-3.5" />
                                                                ) : (
                                                                    <X className="size-3.5" />
                                                                )}
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
                    )}
                </div>

                {/* 4. Pagination */}
                {viewMode === 'table' && (
                    <div className="flex items-center justify-between">
                        <p className="font-sans text-xs text-muted-foreground">
                            {t('staff.reservations.showingCount', {
                                shown: reservations.data.length,
                                total: reservations.total,
                            })}
                        </p>
                        <Pagination meta={reservations} />
                    </div>
                )}
            </div>

            {/* Slide-over Details Drawer */}
            <ReservationDetailsDrawer
                available_services={available_services}
                reservation={selectedReservation}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                onOpenCheckin={(res) => {
                    setSelectedReservation(res);
                    setIsCheckinOpen(true);
                }}
                onOpenPrintSlip={(res) => {
                    setSelectedReservation(res);
                    setIsPrintSlipOpen(true);
                }}
                onAction={runAction}
                confirmUrl={(id) => ReservationController.confirm.url(id)}
                checkOutUrl={(id) => ReservationController.checkOut.url(id)}
                cancelUrl={(id) => ReservationController.cancel.url(id)}
            />

            {/* Smart Check-In Modal */}
            <ReservationCheckinDialog
                reservation={selectedReservation}
                open={isCheckinOpen}
                onOpenChange={setIsCheckinOpen}
            />

            {/* Printable Guest Registration Slip */}
            <ReservationPrintSlip
                reservation={selectedReservation}
                open={isPrintSlipOpen}
                onOpenChange={setIsPrintSlipOpen}
            />

            {/* Invoice Summary after Check-Out */}
            <ReservationCheckoutInvoiceDialog
                invoice={checkoutInvoice}
                open={isCheckoutInvoiceOpen}
                onOpenChange={setIsCheckoutInvoiceOpen}
            />
        </>
    );
}

StaffReservationsIndex.layout = {
    breadcrumbs: [{ title: 'Reservations', href: staffReservationsIndex() }],
};
