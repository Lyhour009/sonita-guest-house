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
import { useTranslation } from '@/hooks/use-translation';
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
    const { t } = useTranslation();
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
            <Head title={t('adminRooms.title')} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        {t('adminRooms.title')}
                    </h1>
                    <RoomCreateDialog />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        placeholder={t('adminRooms.searchPlaceholder')}
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
                            <SelectValue
                                placeholder={t('adminRooms.filters.rentalMode')}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">
                                {t('adminRooms.filters.anyRentalMode')}
                            </SelectItem>
                            <SelectItem value="short_stay">
                                {t('common.reservationType.short_stay')}
                            </SelectItem>
                            <SelectItem value="long_stay">
                                {t('common.reservationType.long_stay')}
                            </SelectItem>
                            <SelectItem value="both">
                                {t('adminRooms.filters.both')}
                            </SelectItem>
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
                            <SelectValue
                                placeholder={t('common.labels.status')}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">
                                {t('adminRooms.filters.anyStatus')}
                            </SelectItem>
                            <SelectItem value="available">
                                {t('common.roomStatus.available')}
                            </SelectItem>
                            <SelectItem value="occupied">
                                {t('common.roomStatus.occupied')}
                            </SelectItem>
                            <SelectItem value="reserved">
                                {t('common.roomStatus.reserved')}
                            </SelectItem>
                            <SelectItem value="cleaning">
                                {t('common.roomStatus.cleaning')}
                            </SelectItem>
                            <SelectItem value="maintenance">
                                {t('common.roomStatus.maintenance')}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('common.labels.room')}</TableHead>
                                <TableHead>{t('common.labels.type')}</TableHead>
                                <TableHead>
                                    {t('adminRooms.table.rentalMode')}
                                </TableHead>
                                <TableHead>
                                    {t('adminRooms.table.pricePerNight')}
                                </TableHead>
                                <TableHead>
                                    {t('adminRooms.table.pricePerMonth')}
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
                            {rooms.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground"
                                    >
                                        {t('adminRooms.empty')}
                                    </TableCell>
                                </TableRow>
                            )}
                            {rooms.data.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell>{room.room_number}</TableCell>
                                    <TableCell>{room.room_type}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {room.rental_mode === 'both'
                                                ? t('adminRooms.filters.both')
                                                : t(
                                                      `common.reservationType.${room.rental_mode}`,
                                                  )}
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
                                            {t(
                                                `common.roomStatus.${room.status}`,
                                            )}
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
                                                {t('common.actions.edit')}
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        {t(
                                                            'common.actions.delete',
                                                        )}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            {t(
                                                                'adminRooms.deleteRoom.title',
                                                                {
                                                                    roomNumber:
                                                                        room.room_number,
                                                                },
                                                            )}
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            {t(
                                                                'adminRooms.deleteRoom.description',
                                                            )}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            {t(
                                                                'common.actions.cancel',
                                                            )}
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            variant="destructive"
                                                            onClick={() =>
                                                                deleteRoom(
                                                                    room.id,
                                                                )
                                                            }
                                                        >
                                                            {t(
                                                                'common.actions.delete',
                                                            )}
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
