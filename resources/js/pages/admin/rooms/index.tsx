import { Head, router } from '@inertiajs/react';
import {
    BedDouble,
    Building2,
    CheckCircle2,
    Copy,
    MoreHorizontal,
    Pencil,
    StickyNote,
    Trash,
    Users,
    Wrench,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Pagination from '@/components/pagination';
import RoomCreateDialog from '@/components/room-create-dialog';
import RoomDuplicateDialog from '@/components/room-duplicate-dialog';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { usePendingAction } from '@/hooks/use-pending-action';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
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
    statusCounts?: {
        all: number;
        available: number;
        occupied: number;
        maintenance: number;
    };
};

export default function AdminRoomsIndex({
    rooms,
    filters,
    statusCounts,
}: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');
    const [rentalMode, setRentalMode] = useState(filters.rental_mode ?? 'any');
    const [status, setStatus] = useState(filters.status ?? 'any');
    const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
    const [duplicatingRoomId, setDuplicatingRoomId] = useState<string | null>(
        null,
    );
    const [isFiltering, setIsFiltering] = useState(false);

    const editingRoom = useMemo(
        () => rooms.data.find((room) => room.id === editingRoomId) ?? null,
        [rooms.data, editingRoomId],
    );

    const duplicatingRoom = useMemo(
        () => rooms.data.find((room) => room.id === duplicatingRoomId) ?? null,
        [rooms.data, duplicatingRoomId],
    );

    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            if (event.detail.visit.only?.includes('rooms')) {
                setIsFiltering(true);
            }
        });
        const removeFinish = router.on('finish', (event) => {
            if (event.detail.visit.only?.includes('rooms')) {
                setIsFiltering(false);
            }
        });

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

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
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-sans text-3xl font-bold tracking-tight">
                            {t('adminRooms.title')}
                        </h1>
                        <p className="mt-1 font-sans text-sm text-muted-foreground">
                            {t('adminRooms.description')}
                        </p>
                    </div>
                </div>

                {/* Pulse KPI Metric Cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                    <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Building2 className="size-4.5" />
                        </div>
                        <div>
                            <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                {statusCounts?.all || 0}
                            </p>
                            <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                {t('adminRooms.title')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-4.5" />
                        </div>
                        <div>
                            <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                {statusCounts?.available || 0}
                            </p>
                            <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                {t('common.roomStatus.available')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-warning/10 text-amber-600 dark:text-amber-400">
                            <Users className="size-4.5" />
                        </div>
                        <div>
                            <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                {statusCounts?.occupied || 0}
                            </p>
                            <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                {t('common.roomStatus.occupied')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-rose-600 dark:text-rose-400">
                            <Wrench className="size-4.5" />
                        </div>
                        <div>
                            <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                {statusCounts?.maintenance || 0}
                            </p>
                            <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                {t('common.roomStatus.maintenance')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-stretch gap-3 rounded-3xl border border-border/50 bg-card/60 p-3 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex flex-col items-stretch gap-3 sm:flex-1 sm:flex-row sm:items-center sm:gap-4">
                        <Input
                            placeholder={t('adminRooms.searchPlaceholder')}
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="h-10 rounded-2xl bg-background font-sans shadow-2xs sm:max-w-xs"
                        />

                        <Select
                            value={rentalMode}
                            onValueChange={(value) => {
                                setRentalMode(value);
                                applyFilters({ rental_mode: value });
                            }}
                        >
                            <SelectTrigger className="h-10 w-full rounded-2xl bg-background font-sans shadow-2xs sm:w-44">
                                <SelectValue
                                    placeholder={t(
                                        'adminRooms.filters.rentalMode',
                                    )}
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
                            <SelectTrigger className="h-10 w-full rounded-2xl bg-background font-sans shadow-2xs sm:w-44">
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

                    <div>
                        <RoomCreateDialog />
                    </div>
                </div>

                {rooms.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-border/50 bg-card/50 py-24 text-center shadow-sm backdrop-blur-sm">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-3xl bg-muted shadow-inner">
                            <BedDouble className="size-8 text-muted-foreground opacity-50" />
                        </div>
                        <h3 className="font-sans text-xl font-bold text-foreground">
                            {t('adminRooms.empty')}
                        </h3>
                        <p className="mt-1 max-w-sm text-center font-sans text-sm text-muted-foreground">
                            {t('adminRooms.emptyDescription')}
                        </p>
                    </div>
                ) : (
                    <div
                        className={cn(
                            'grid gap-6 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                            isFiltering && 'pointer-events-none opacity-50',
                        )}
                    >
                        {rooms.data.map((room) => (
                            <div
                                key={room.id}
                                className="group flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card font-sans shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                            >
                                <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-muted">
                                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-black/5 opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

                                    {room.images && room.images.length > 0 ? (
                                        <img
                                            src={room.images[0].url}
                                            alt={room.room_type}
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />
                                    ) : (
                                        <BedDouble className="size-12 text-muted-foreground/30 transition-transform duration-700 group-hover:scale-110" />
                                    )}

                                    {/* Top Badges */}
                                    <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                                        <Badge
                                            variant="outline"
                                            className="border-border/50 bg-background/90 font-semibold tracking-wide text-foreground shadow-sm backdrop-blur"
                                        >
                                            {room.rental_mode === 'both'
                                                ? t('adminRooms.filters.both')
                                                : t(
                                                      `common.reservationType.${room.rental_mode}`,
                                                  )}
                                        </Badge>
                                        <Badge
                                            className={`border-0 font-semibold tracking-wide shadow-sm ${
                                                room.status === 'available'
                                                    ? 'bg-success/90 text-white hover:bg-success/90'
                                                    : room.status === 'occupied'
                                                      ? 'bg-warning/90 text-white hover:bg-warning/90'
                                                      : room.status ===
                                                          'maintenance'
                                                        ? 'bg-danger/90 text-white hover:bg-danger/90'
                                                        : 'bg-primary/90 text-white hover:bg-primary/90'
                                            }`}
                                        >
                                            {t(
                                                `common.roomStatus.${room.status}`,
                                            )}
                                        </Badge>
                                    </div>

                                    {/* Micro Badges (Occupants & Floor) */}
                                    <div className="absolute right-3 bottom-3 z-20 flex gap-1.5">
                                        {room.floor !== null && (
                                            <div className="flex h-6 items-center gap-1 rounded-full bg-background/80 px-2 text-[10px] font-bold shadow-sm backdrop-blur-md">
                                                <Building2 className="size-3 text-muted-foreground" />
                                                <span>Fl {room.floor}</span>
                                            </div>
                                        )}
                                        <div className="flex h-6 items-center gap-1 rounded-full bg-background/80 px-2 text-[10px] font-bold shadow-sm backdrop-blur-md">
                                            <Users className="size-3 text-muted-foreground" />
                                            <span>{room.max_occupants}</span>
                                        </div>
                                    </div>

                                    {/* Floating Action Menu */}
                                    <div className="absolute top-3 right-3 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full bg-background/90 shadow-sm backdrop-blur-md transition-transform hover:scale-110 hover:bg-background"
                                                >
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-48 rounded-xl font-sans"
                                            >
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setEditingRoomId(
                                                            room.id,
                                                        )
                                                    }
                                                >
                                                    <Pencil className="mr-2 size-4" />
                                                    {t('common.actions.edit')}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setDuplicatingRoomId(
                                                            room.id,
                                                        )
                                                    }
                                                >
                                                    <Copy className="mr-2 size-4" />
                                                    {t('adminRooms.duplicate')}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem
                                                            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                            onSelect={(e) =>
                                                                e.preventDefault()
                                                            }
                                                        >
                                                            <Trash className="mr-2 size-4" />
                                                            {t(
                                                                'common.actions.delete',
                                                            )}
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-2xl">
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
                                                            <AlertDialogCancel className="rounded-xl">
                                                                <X className="mr-2 size-4" />
                                                                {t(
                                                                    'common.actions.cancel',
                                                                )}
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                variant="destructive"
                                                                className="rounded-xl"
                                                                disabled={isPending(
                                                                    `delete-${room.id}`,
                                                                )}
                                                                onClick={() =>
                                                                    deleteRoom(
                                                                        room.id,
                                                                    )
                                                                }
                                                            >
                                                                {isPending(
                                                                    `delete-${room.id}`,
                                                                ) ? (
                                                                    <Spinner className="mr-2" />
                                                                ) : (
                                                                    <Trash className="mr-2 size-4" />
                                                                )}
                                                                {t(
                                                                    'common.actions.delete',
                                                                )}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col bg-gradient-to-b from-card to-muted/20 p-5">
                                    <div className="mb-3 flex items-start justify-between">
                                        <div>
                                            <h3 className="mb-1 flex items-center gap-1.5 text-lg leading-tight font-bold text-foreground">
                                                <span>{room.room_type}</span>
                                                {room.notes && (
                                                    <span
                                                        title={t(
                                                            'adminRooms.hasNotes',
                                                        )}
                                                    >
                                                        <StickyNote className="size-3.5 shrink-0 text-amber-500" />
                                                    </span>
                                                )}
                                            </h3>
                                            <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                #{room.room_number}
                                            </span>
                                        </div>
                                    </div>

                                    {room.amenities && (
                                        <div className="mb-4 flex flex-wrap gap-1">
                                            {room.amenities
                                                .split(',')
                                                .slice(0, 3)
                                                .map((amenity, i) => (
                                                    <span
                                                        key={i}
                                                        className="max-w-[80px] truncate rounded-full border border-primary/10 bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary"
                                                    >
                                                        {amenity.trim()}
                                                    </span>
                                                ))}
                                            {room.amenities.split(',').length >
                                                3 && (
                                                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                                    +
                                                    {room.amenities.split(',')
                                                        .length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-auto flex items-end justify-between border-t border-border/60 pt-4">
                                        <div className="flex flex-col">
                                            <span className="mb-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                {t(
                                                    'adminRooms.table.pricePerNight',
                                                )}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-bold tracking-tighter text-foreground">
                                                    ${room.price_per_night}
                                                </span>
                                            </div>
                                        </div>
                                        {room.rental_mode !== 'short_stay' && (
                                            <div className="flex flex-col text-right">
                                                <span className="mb-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Monthly
                                                </span>
                                                <div className="flex items-baseline justify-end gap-1">
                                                    <span className="text-lg font-bold tracking-tighter text-foreground">
                                                        ${room.price_per_month}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
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

            <RoomDuplicateDialog
                room={duplicatingRoom}
                onOpenChange={(open) => !open && setDuplicatingRoomId(null)}
            />
        </>
    );
}

AdminRoomsIndex.layout = {
    breadcrumbs: [{ title: 'Rooms', href: adminRoomsIndex() }],
};
