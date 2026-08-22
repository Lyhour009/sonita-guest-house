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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { BedDouble, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { usePendingAction } from '@/hooks/use-pending-action';
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

    const debouncedSearch = useDebouncedValue(search, 300);

    useEffect(() => {
        applyFilters({ search: debouncedSearch });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const { isPending, withPending } = usePendingAction();

    const deleteRoom = (roomId: string) => {
        router.delete(
            destroy(roomId).url,
            withPending(`delete-${roomId}`, { preserveScroll: true }),
        );
    };

    return (
        <>
            <Head title={t('adminRooms.title')} />

            <div className="space-y-8 p-6 lg:p-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {t('adminRooms.title')}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage all your properties, pricing, and statuses in one place.
                        </p>
                    </div>
                    <RoomCreateDialog />
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-card/50 p-4 rounded-2xl border border-border/50 shadow-sm">
                    <Input
                        placeholder={t('adminRooms.searchPlaceholder')}
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="max-w-xs bg-background rounded-xl h-10"
                    />

                    <Select
                        value={rentalMode}
                        onValueChange={(value) => {
                            setRentalMode(value);
                            applyFilters({ rental_mode: value });
                        }}
                    >
                        <SelectTrigger className="w-44 bg-background rounded-xl h-10">
                            <SelectValue
                                placeholder={t('adminRooms.filters.rentalMode')}
                            />
                        </SelectTrigger>
                        <SelectContent portaled={false}>
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
                        <SelectTrigger className="w-44 bg-background rounded-xl h-10">
                            <SelectValue
                                placeholder={t('common.labels.status')}
                            />
                        </SelectTrigger>
                        <SelectContent portaled={false}>
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

                {rooms.data.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center bg-card rounded-3xl border border-dashed">
                        <BedDouble className="size-12 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-lg font-medium text-muted-foreground">{t('adminRooms.empty')}</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {rooms.data.map((room) => (
                            <div
                                key={room.id}
                                className="group flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className="aspect-[4/3] relative w-full bg-muted flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    {room.images && room.images.length > 0 ? (
                                        <img
                                            src={room.images[0].url}
                                            alt={room.room_type}
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                    ) : (
                                        <BedDouble className="size-12 text-muted-foreground/30" />
                                    )}

                                    <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                                        <Badge variant="secondary" className="bg-background/80 backdrop-blur shadow-sm">
                                            {room.rental_mode === 'both' ? t('adminRooms.filters.both') : t(`common.reservationType.${room.rental_mode}`)}
                                        </Badge>
                                        <Badge
                                            variant={room.status === 'available' ? 'default' : 'secondary'}
                                            className="bg-background/80 backdrop-blur shadow-sm"
                                        >
                                            {t(`common.roomStatus.${room.status}`)}
                                        </Badge>
                                    </div>

                                    <div className="absolute top-3 right-3 z-20">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur shadow-sm hover:bg-background">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-xl" portaled={false}>
                                                <DropdownMenuItem onClick={() => setEditingRoomId(room.id)}>
                                                    <Pencil className="mr-2 size-4" />
                                                    {t('common.actions.edit')}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                                                            onSelect={(e) => e.preventDefault()}
                                                        >
                                                            <Trash className="mr-2 size-4" />
                                                            {t('common.actions.delete')}
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-2xl">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                {t('adminRooms.deleteRoom.title', { roomNumber: room.room_number })}
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                {t('adminRooms.deleteRoom.description')}
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="rounded-xl">{t('common.actions.cancel')}</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                variant="destructive"
                                                                className="rounded-xl"
                                                                disabled={isPending(`delete-${room.id}`)}
                                                                onClick={() => deleteRoom(room.id)}
                                                            >
                                                                {isPending(`delete-${room.id}`) && <Spinner className="mr-2" />}
                                                                {t('common.actions.delete')}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg leading-none mb-1">{room.room_type}</h3>
                                            <span className="text-sm font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                                                #{room.room_number}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground text-xs">{t('adminRooms.table.pricePerNight')}</span>
                                            <span className="font-semibold">${room.price_per_night}</span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-muted-foreground text-xs">{t('adminRooms.table.pricePerMonth')}</span>
                                            <span className="font-semibold">${room.price_per_month}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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
