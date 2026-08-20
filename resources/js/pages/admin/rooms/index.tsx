import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import Pagination from '@/components/pagination';
import RoomCreateDialog from '@/components/room-create-dialog';
import RoomEditDialog from '@/components/room-edit-dialog';
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
import { destroy, index as adminRoomsIndex } from '@/routes/admin/rooms';
import type { Paginated, RoomDetail } from '@/types';

type Filters = {
    search: string | null;
    rental_mode: string | null;
    status: string | null;
};

type Props = {
    rooms: Paginated<RoomDetail>;
    filters: Filters;
};

export default function AdminRoomsIndex({ rooms, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [rentalMode, setRentalMode] = useState(filters.rental_mode ?? 'any');
    const [status, setStatus] = useState(filters.status ?? 'any');
    const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

    const editingRoom = useMemo(
        () => rooms.data.find((room) => room.id === editingRoomId) ?? null,
        [rooms.data, editingRoomId],
    );

    const applyFilters = (next: Partial<Filters>) => {
        const nextSearch = next.search ?? search;
        const nextRentalMode = next.rental_mode ?? rentalMode;
        const nextStatus = next.status ?? status;

        router.get(
            adminRoomsIndex().url,
            {
                search: nextSearch || undefined,
                rental_mode:
                    nextRentalMode === 'any' ? undefined : nextRentalMode,
                status: nextStatus === 'any' ? undefined : nextStatus,
            },
            { preserveState: true, replace: true, only: ['rooms', 'filters'] },
        );
    };

    useEffect(() => {
        const timeout = setTimeout(() => applyFilters({ search }), 300);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const deleteRoom = (roomId: string) => {
        router.delete(destroy(roomId).url, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Rooms" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Rooms</h1>
                    <RoomCreateDialog />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        placeholder="Search by room number or type..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="max-w-xs"
                    />

                    <Select
                        value={rentalMode}
                        onValueChange={(value) => {
                            setRentalMode(value);
                            applyFilters({ rental_mode: value });
                        }}
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Rental mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any rental mode</SelectItem>
                            <SelectItem value="short_stay">
                                Short stay
                            </SelectItem>
                            <SelectItem value="long_stay">Long stay</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={status}
                        onValueChange={(value) => {
                            setStatus(value);
                            applyFilters({ status: value });
                        }}
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any status</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="occupied">Occupied</SelectItem>
                            <SelectItem value="reserved">Reserved</SelectItem>
                            <SelectItem value="cleaning">Cleaning</SelectItem>
                            <SelectItem value="maintenance">
                                Maintenance
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Rental mode</TableHead>
                                <TableHead>Price / night</TableHead>
                                <TableHead>Price / month</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rooms.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground"
                                    >
                                        No rooms match your filters.
                                    </TableCell>
                                </TableRow>
                            )}
                            {rooms.data.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell>{room.room_number}</TableCell>
                                    <TableCell>{room.room_type}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {room.rental_mode}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        ${room.price_per_night}
                                    </TableCell>
                                    <TableCell>
                                        ${room.price_per_month}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                room.status === 'available'
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                        >
                                            {room.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setEditingRoomId(room.id)
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Delete room{' '}
                                                            {room.room_number}?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will
                                                            permanently delete
                                                            the room and its
                                                            images. This cannot
                                                            be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            variant="destructive"
                                                            onClick={() =>
                                                                deleteRoom(
                                                                    room.id,
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Pagination meta={rooms} />
            </div>

            <RoomEditDialog
                room={editingRoom}
                onOpenChange={(open) => !open && setEditingRoomId(null)}
            />
        </>
    );
}

AdminRoomsIndex.layout = {
    breadcrumbs: [{ title: 'Rooms', href: adminRoomsIndex() }],
};
