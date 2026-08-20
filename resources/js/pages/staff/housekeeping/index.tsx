import { Head, router } from '@inertiajs/react';
import HousekeepingController from '@/actions/App/Http/Controllers/Staff/HousekeepingController';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { index as staffHousekeepingIndex } from '@/routes/staff/housekeeping';
import type { CleaningRoom } from '@/types';

type Props = {
    rooms: CleaningRoom[];
};

export default function StaffHousekeepingIndex({ rooms }: Props) {
    const markClean = (roomId: string) => {
        router.patch(
            HousekeepingController.markClean.url(roomId),
            {},
            { preserveScroll: true, only: ['rooms'] },
        );
    };

    return (
        <>
            <Head title="Room status" />

            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold">
                    Rooms awaiting cleaning
                </h1>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Floor</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rooms.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center text-muted-foreground"
                                    >
                                        No rooms currently need cleaning.
                                    </TableCell>
                                </TableRow>
                            )}
                            {rooms.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell>{room.room_number}</TableCell>
                                    <TableCell>{room.room_type}</TableCell>
                                    <TableCell>{room.floor ?? '—'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            onClick={() => markClean(room.id)}
                                        >
                                            Mark clean
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

StaffHousekeepingIndex.layout = {
    breadcrumbs: [{ title: 'Room status', href: staffHousekeepingIndex() }],
};
