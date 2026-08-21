import { Head, Link, usePage } from '@inertiajs/react';
import PublicHeader from '@/components/public-header';
import ReservationBookDialog from '@/components/reservation-book-dialog';
import RoomAvailabilityCalendar from '@/components/room-availability-calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';
import { home, login } from '@/routes';
import type { RoomBookedRange, RoomDetail } from '@/types';

type Props = {
    room: RoomDetail;
    bookedRanges: RoomBookedRange[];
};

export default function RoomShow({ room, bookedRanges }: Props) {
    const { auth } = usePage().props;
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${room.room_type} · ${room.room_number}`} />
            <div className="min-h-screen bg-background p-6 lg:p-10">
                <PublicHeader
                    className="max-w-4xl"
                    left={
                        <Link
                            href={home()}
                            className="text-sm text-muted-foreground hover:underline"
                        >
                            {t('rooms.detail.backToRooms')}
                        </Link>
                    }
                />

                <div className="mx-auto w-full max-w-4xl space-y-6">
                    {room.images.length > 0 ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                            {room.images.map((image, index) => (
                                <img
                                    key={image.id}
                                    src={image.url}
                                    alt={`${room.room_type} photo ${index + 1}`}
                                    className={
                                        index === 0
                                            ? 'aspect-video w-full rounded-xl object-cover sm:col-span-2'
                                            : 'aspect-video w-full rounded-xl object-cover'
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="aspect-video w-full rounded-xl bg-muted" />
                    )}

                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold">
                                {t('rooms.detail.heading', {
                                    type: room.room_type,
                                    number: room.room_number,
                                })}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {room.floor
                                    ? `${t('rooms.detail.floor', { floor: room.floor })} · `
                                    : ''}
                                {t(
                                    room.max_occupants > 1
                                        ? 'rooms.maxOccupants.other'
                                        : 'rooms.maxOccupants.one',
                                    { count: room.max_occupants },
                                )}
                            </p>
                        </div>
                        <Badge variant="secondary">
                            {t(`rooms.rentalModeDetail.${room.rental_mode}`)}
                        </Badge>
                    </div>

                    <Separator />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {t('rooms.detail.perNight')}
                            </p>
                            <p className="text-xl font-semibold">
                                ${room.price_per_night}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {t('rooms.detail.perMonth')}
                            </p>
                            <p className="text-xl font-semibold">
                                ${room.price_per_month}
                            </p>
                        </div>
                    </div>

                    {room.description && (
                        <div>
                            <h2 className="mb-1 font-medium">
                                {t('rooms.detail.description')}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {room.description}
                            </p>
                        </div>
                    )}

                    {room.amenities && (
                        <div>
                            <h2 className="mb-1 font-medium">
                                {t('rooms.detail.amenities')}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {room.amenities}
                            </p>
                        </div>
                    )}

                    <Separator />

                    <RoomAvailabilityCalendar bookedRanges={bookedRanges} />

                    <Separator />

                    <div className="max-w-xs">
                        {auth.user?.role === 'guest' ? (
                            <ReservationBookDialog room={room} />
                        ) : !auth.user ? (
                            <Button asChild className="w-full">
                                <Link href={login()}>
                                    {t('nav.logInToBook')}
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}
