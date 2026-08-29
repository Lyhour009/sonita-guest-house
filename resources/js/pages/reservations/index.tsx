import { Head, router } from '@inertiajs/react';
import { CalendarCheck } from 'lucide-react';
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
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Locale } from '@/hooks/use-locale';
import { usePendingAction } from '@/hooks/use-pending-action';
import { useTranslation } from '@/hooks/use-translation';
import { translate } from '@/lib/i18n/translate';
import { getReservationStatusInfo } from '@/lib/status-badges';
import { cn } from '@/lib/utils';
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
    const { isPending, withPending } = usePendingAction();

    const cancel = (reservationId: string) => {
        router.patch(
            ReservationController.cancel.url(reservationId),
            {},
            withPending(`cancel-${reservationId}`, { preserveScroll: true }),
        );
    };

    return (
        <>
            <Head title={t('reservations.page.title')} />

            <div className="w-full space-y-5 bg-background p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                        {t('reservations.page.title')}
                    </h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {t('reservations.page.subtitle')}
                    </p>
                </div>

                {reservations.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-border/50 bg-card/50 py-24 text-center shadow-sm backdrop-blur-sm">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-3xl bg-muted shadow-inner">
                            <CalendarCheck className="size-8 text-muted-foreground opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                            {t('reservations.page.empty')}
                        </h3>
                        <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">
                            {t('reservations.page.emptyDescription')}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-md">
                        <Table>
                            <TableHeader className="border-b border-border bg-muted/50">
                                <TableRow className="h-13 border-border hover:bg-transparent">
                                    <TableHead className="h-13 py-4 pl-6 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.room')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.type')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('reservations.table.dates')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.status')}
                                    </TableHead>
                                    <TableHead className="h-13 py-4 pr-6 text-right text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.actions.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border/60">
                                {reservations.data.map((reservation) => {
                                    const statusInfo = getReservationStatusInfo(
                                        t,
                                        reservation.status,
                                    );

                                    return (
                                        <TableRow
                                            key={reservation.id}
                                            className="h-16 transition-all duration-300 hover:bg-primary/5"
                                        >
                                            <TableCell className="py-3.5 pl-6">
                                                <span className="flex h-8 min-w-10 items-center justify-center rounded-xl border border-border/90 bg-background px-2.5 text-[13px] font-bold text-foreground shadow-2xs">
                                                    #
                                                    {
                                                        reservation.room
                                                            .room_number
                                                    }
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <div className="text-sm font-semibold text-foreground">
                                                    {reservation.room.room_type}
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className="mt-1 font-normal"
                                                >
                                                    {t(
                                                        `common.reservationType.${reservation.reservation_type}`,
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-sm text-muted-foreground">
                                                {dateRange(reservation, locale)}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'gap-1 font-semibold',
                                                        statusInfo.className,
                                                    )}
                                                >
                                                    {statusInfo.pulse && (
                                                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                                                    )}
                                                    {statusInfo.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-3.5 pr-6 text-right">
                                                {cancellableStatuses.includes(
                                                    reservation.status,
                                                ) && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                className="h-8 rounded-full"
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
                                                                    disabled={isPending(
                                                                        `cancel-${reservation.id}`,
                                                                    )}
                                                                    onClick={() =>
                                                                        cancel(
                                                                            reservation.id,
                                                                        )
                                                                    }
                                                                >
                                                                    {isPending(
                                                                        `cancel-${reservation.id}`,
                                                                    ) && (
                                                                        <Spinner className="mr-2" />
                                                                    )}
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
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <Pagination meta={reservations} />
            </div>
        </>
    );
}

ReservationsIndex.layout = {
    breadcrumbs: [{ title: 'My reservations', href: reservationsIndex() }],
};
