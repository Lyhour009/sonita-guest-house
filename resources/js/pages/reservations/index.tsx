import { Head, router } from '@inertiajs/react';
import ReservationController from '@/actions/App/Http/Controllers/ReservationController';
import Pagination from '@/components/pagination';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Locale } from '@/hooks/use-locale';
import { useTranslation } from '@/hooks/use-translation';
import { translate } from '@/lib/i18n/translate';
import { index as reservationsIndex } from '@/routes/reservations';
import type { Paginated, Reservation } from '@/types';

type Props = {
    reservations: Paginated<Reservation>;
};

const cancellableStatuses = ['pending', 'confirmed', 'active'];

function dateRange(reservation: Reservation, locale: Locale) {
    if (reservation.reservation_type === 'short_stay') {
        return `${reservation.check_in_date} → ${reservation.check_out_date}`;
    }

    return `${reservation.start_date} → ${reservation.end_date ?? translate(locale, 'reservations.dateRange.openEnded')}`;
}

export default function ReservationsIndex({ reservations }: Props) {
    const { t, locale } = useTranslation();
    const cancel = (reservationId: string) => {
        router.patch(
            ReservationController.cancel.url(reservationId),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="My reservations" />

            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold">
                    {t('reservations.page.title')}
                </h1>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('common.labels.room')}</TableHead>
                                <TableHead>{t('common.labels.type')}</TableHead>
                                <TableHead>
                                    {t('reservations.table.dates')}
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
                                        colSpan={5}
                                        className="text-center text-muted-foreground"
                                    >
                                        {t('reservations.page.empty')}
                                    </TableCell>
                                </TableRow>
                            )}
                            {reservations.data.map((reservation) => (
                                <TableRow key={reservation.id}>
                                    <TableCell>
                                        {reservation.room.room_type} ·{' '}
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
                                        {dateRange(reservation, locale)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {t(
                                                `common.reservationStatus.${reservation.status}`,
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {cancellableStatuses.includes(
                                            reservation.status,
                                        ) && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        {t(
                                                            'common.actions.cancel',
                                                        )}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            {t(
                                                                'reservations.cancelDialog.title',
                                                            )}
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            {t(
                                                                'reservations.cancelDialog.description',
                                                            )}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            {t(
                                                                'reservations.cancelDialog.keepIt',
                                                            )}
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            variant="destructive"
                                                            onClick={() =>
                                                                cancel(
                                                                    reservation.id,
                                                                )
                                                            }
                                                        >
                                                            {t(
                                                                'reservations.cancelDialog.confirm',
                                                            )}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
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

ReservationsIndex.layout = {
    breadcrumbs: [{ title: 'My reservations', href: reservationsIndex() }],
};
