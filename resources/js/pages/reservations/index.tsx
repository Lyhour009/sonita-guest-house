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
import { index as reservationsIndex } from '@/routes/reservations';
import type { Paginated, Reservation } from '@/types';

type Props = {
    reservations: Paginated<Reservation>;
};

const cancellableStatuses = ['pending', 'confirmed', 'active'];

function dateRange(reservation: Reservation) {
    if (reservation.reservation_type === 'short_stay') {
        return `${reservation.check_in_date} → ${reservation.check_out_date}`;
    }

    return `${reservation.start_date} → ${reservation.end_date ?? 'open-ended'}`;
}

export default function ReservationsIndex({ reservations }: Props) {
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
                <h1 className="text-xl font-semibold">My reservations</h1>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
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
                                        You have no reservations yet.
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
                                            {reservation.reservation_type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {dateRange(reservation)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {reservation.status}
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
                                                        Cancel
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Cancel this
                                                            reservation?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This cannot be
                                                            undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Keep it
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            variant="destructive"
                                                            onClick={() =>
                                                                cancel(
                                                                    reservation.id,
                                                                )
                                                            }
                                                        >
                                                            Cancel reservation
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
