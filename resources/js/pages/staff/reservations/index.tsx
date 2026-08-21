import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ReservationController from '@/actions/App/Http/Controllers/Staff/ReservationController';
import Pagination from '@/components/pagination';
import ReservationWalkinDialog from '@/components/reservation-walkin-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

type Props = {
    reservations: Paginated<StaffReservation>;
    filters: Filters;
    guests: ReservationGuestSummary[];
    rooms: RoomOption[];
};

export default function StaffReservationsIndex({
    reservations,
    filters,
    guests,
    rooms,
}: Props) {
    const { t } = useTranslation();

    const dateRange = (reservation: StaffReservation) => {
        if (reservation.reservation_type === 'short_stay') {
            return `${reservation.check_in_date} → ${reservation.check_out_date}`;
        }

        return `${reservation.start_date} → ${reservation.end_date ?? t('staff.reservations.openEnded')}`;
    };

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'any');

    const applyFilters = (next: Partial<Filters>) => {
        const nextSearch = next.search ?? search;
        const nextStatus = next.status ?? status;

        router.get(
            staffReservationsIndex().url,
            {
                search: nextSearch || undefined,
                status: nextStatus === 'any' ? undefined : nextStatus,
            },
            {
                preserveState: true,
                replace: true,
                only: ['reservations', 'filters'],
            },
        );
    };

    useEffect(() => {
        const timeout = setTimeout(() => applyFilters({ search }), 300);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const runAction = (url: string) => {
        router.patch(url, {}, { preserveScroll: true, only: ['reservations'] });
    };

    return (
        <>
            <Head title={t('nav.staff.reservations')} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        {t('nav.staff.reservations')}
                    </h1>
                    <ReservationWalkinDialog guests={guests} rooms={rooms} />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        placeholder={t('staff.reservations.searchPlaceholder')}
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="max-w-xs"
                    />

                    <Select
                        value={status}
                        onValueChange={(value) => {
                            setStatus(value);
                            applyFilters({ status: value });
                        }}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue
                                placeholder={t('common.labels.status')}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">
                                {t('staff.reservations.anyStatus')}
                            </SelectItem>
                            <SelectItem value="pending">
                                {t('common.reservationStatus.pending')}
                            </SelectItem>
                            <SelectItem value="confirmed">
                                {t('common.reservationStatus.confirmed')}
                            </SelectItem>
                            <SelectItem value="checked_in">
                                {t('common.reservationStatus.checked_in')}
                            </SelectItem>
                            <SelectItem value="checked_out">
                                {t('common.reservationStatus.checked_out')}
                            </SelectItem>
                            <SelectItem value="active">
                                {t('common.reservationStatus.active')}
                            </SelectItem>
                            <SelectItem value="cancelled">
                                {t('common.reservationStatus.cancelled')}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    {t('common.labels.guest')}
                                </TableHead>
                                <TableHead>{t('common.labels.room')}</TableHead>
                                <TableHead>{t('common.labels.type')}</TableHead>
                                <TableHead>
                                    {t('staff.reservations.table.dates')}
                                </TableHead>
                                <TableHead>
                                    {t('common.labels.status')}
                                </TableHead>
                                <TableHead className="text-right">
                                    {t('common.actions.actions')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reservations.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center text-muted-foreground"
                                    >
                                        {t('staff.reservations.empty')}
                                    </TableCell>
                                </TableRow>
                            )}
                            {reservations.data.map((reservation) => (
                                <TableRow key={reservation.id}>
                                    <TableCell>
                                        {reservation.guest.full_name}
                                    </TableCell>
                                    <TableCell>
                                        {reservation.room.room_number}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {t(
                                                `common.reservationType.${reservation.reservation_type}`,
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {dateRange(reservation)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {t(
                                                `common.reservationStatus.${reservation.status}`,
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {reservation.status ===
                                                'pending' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        runAction(
                                                            ReservationController.confirm.url(
                                                                reservation.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    {t(
                                                        'common.actions.confirm',
                                                    )}
                                                </Button>
                                            )}
                                            {reservation.status ===
                                                'confirmed' &&
                                                reservation.reservation_type ===
                                                    'short_stay' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            runAction(
                                                                ReservationController.checkIn.url(
                                                                    reservation.id,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            'staff.reservations.checkIn',
                                                        )}
                                                    </Button>
                                                )}
                                            {reservation.status ===
                                                'checked_in' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        runAction(
                                                            ReservationController.checkOut.url(
                                                                reservation.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    {t(
                                                        'staff.reservations.checkOut',
                                                    )}
                                                </Button>
                                            )}
                                            {[
                                                'pending',
                                                'confirmed',
                                                'active',
                                            ].includes(reservation.status) && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        runAction(
                                                            ReservationController.cancel.url(
                                                                reservation.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    {t('common.actions.cancel')}
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Pagination meta={reservations} />
            </div>
        </>
    );
}

StaffReservationsIndex.layout = {
    breadcrumbs: [{ title: 'Reservations', href: staffReservationsIndex() }],
};
