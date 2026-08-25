import { Head, Link, usePage } from '@inertiajs/react';
import {
    BedDouble,
    Car,
    Check,
    Coffee,
    Dumbbell,
    LogIn,
    MapPin,
    Star,
    Tv,
    UtensilsCrossed,
    Waves,
    Wifi,
    Wind,
} from 'lucide-react';
import PublicHeader from '@/components/public-header';
import ReservationBookDialog from '@/components/reservation-book-dialog';
import RoomAvailabilityCalendar from '@/components/room-availability-calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { home, login } from '@/routes';
import type { RoomBookedRange, RoomDetail, RoomFilters } from '@/types';

type Props = {
    room: RoomDetail;
    bookedRanges: RoomBookedRange[];
    searchFilters: RoomFilters;
};

/** Gives common amenities a recognizable icon instead of a generic checkmark. */
function amenityIcon(amenity: string) {
    const normalized = amenity.trim().toLowerCase();

    if (normalized.includes('wifi') || normalized.includes('internet')) {
        return Wifi;
    }

    if (normalized.includes('tv') || normalized.includes('television')) {
        return Tv;
    }

    if (normalized.includes('air') || normalized.includes('ac')) {
        return Wind;
    }

    if (normalized.includes('parking')) {
        return Car;
    }

    if (normalized.includes('kitchen')) {
        return UtensilsCrossed;
    }

    if (normalized.includes('breakfast')) {
        return Coffee;
    }

    if (normalized.includes('pool')) {
        return Waves;
    }

    if (normalized.includes('gym') || normalized.includes('fitness')) {
        return Dumbbell;
    }

    return Check;
}

export default function RoomShow({ room, bookedRanges, searchFilters }: Props) {
    const { auth } = usePage().props;
    const { t } = useTranslation();

    const initialType = searchFilters.stay_type ?? undefined;
    const initialCheckInDate =
        initialType === 'short_stay'
            ? (searchFilters.from ?? undefined)
            : undefined;
    const initialCheckOutDate =
        initialType === 'short_stay'
            ? (searchFilters.to ?? undefined)
            : undefined;
    const initialStartDate =
        initialType === 'long_stay'
            ? (searchFilters.from ?? undefined)
            : undefined;
    const initialEndDate =
        initialType === 'long_stay'
            ? (searchFilters.to ?? undefined)
            : undefined;

    const images = room.images ?? [];
    const hero = images[0];
    const thumbnails = images.slice(1, 5);
    const extraPhotoCount = Math.max(0, images.length - 5);
    const thumbGridClass =
        thumbnails.length >= 4
            ? 'grid-cols-2 grid-rows-2'
            : thumbnails.length === 3
              ? 'grid-rows-3'
              : thumbnails.length === 2
                ? 'grid-rows-2'
                : 'grid-rows-1';

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

                <div className="mx-auto w-full max-w-6xl space-y-6">
                    {/* Header Title above gallery */}
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                                {t('rooms.detail.heading', {
                                    type: room.room_type,
                                    number: room.room_number,
                                })}
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <MapPin className="size-4 text-primary" />
                                    {t('welcome.header.address')}
                                </span>
                                <span>·</span>
                                <span>
                                    {room.floor
                                        ? t('rooms.detail.floor', {
                                              floor: room.floor,
                                          })
                                        : t('rooms.detail.groundFloor')}
                                </span>
                                {room.reviews_count > 0 && (
                                    <>
                                        <span>·</span>
                                        <span className="flex items-center gap-1 font-semibold text-foreground">
                                            <Star className="size-4 fill-amber-400 text-amber-400" />
                                            {room.average_rating}
                                            <span className="font-normal text-muted-foreground">
                                                (
                                                {t(
                                                    room.reviews_count === 1
                                                        ? 'rooms.reviews.countOne'
                                                        : 'rooms.reviews.countOther',
                                                    {
                                                        count: room.reviews_count,
                                                    },
                                                )}
                                                )
                                            </span>
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Photo gallery — layout adapts to however many photos this room actually has */}
                    {hero ? (
                        <div
                            className={cn(
                                'grid h-[55vh] max-h-[650px] min-h-[450px] gap-2 overflow-hidden rounded-[2.5rem] border border-border/10 shadow-xl',
                                thumbnails.length > 0
                                    ? 'grid-cols-1 sm:grid-cols-[2fr_1fr]'
                                    : 'grid-cols-1',
                            )}
                        >
                            <div className="group relative overflow-hidden bg-muted">
                                <img
                                    src={hero.url}
                                    alt={`${room.room_type} main view`}
                                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                            </div>

                            {thumbnails.length > 0 && (
                                <div
                                    className={cn(
                                        'hidden gap-2 sm:grid',
                                        thumbGridClass,
                                    )}
                                >
                                    {thumbnails.map((image, index) => {
                                        const isLastTile =
                                            index === thumbnails.length - 1;

                                        return (
                                            <div
                                                key={image.id}
                                                className="group relative overflow-hidden bg-muted"
                                            >
                                                <img
                                                    src={image.url}
                                                    alt={`${room.room_type} view ${index + 2}`}
                                                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                                />
                                                {isLastTile &&
                                                    extraPhotoCount > 0 && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-base font-semibold text-white">
                                                            {t(
                                                                'rooms.detail.morePhotos',
                                                                {
                                                                    count: extraPhotoCount,
                                                                },
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex h-[55vh] max-h-[650px] min-h-[450px] flex-col items-center justify-center gap-2 rounded-[2.5rem] border border-border/10 bg-muted text-muted-foreground shadow-xl">
                            <BedDouble className="size-16 opacity-30" />
                            <span className="text-sm font-medium opacity-60">
                                {t('rooms.detail.noPhotos')}
                            </span>
                        </div>
                    )}

                    <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
                        {/* Left Content Column */}
                        <div className="space-y-10">
                            <div className="flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-xl font-semibold">
                                    {t(
                                        room.max_occupants > 1
                                            ? 'rooms.maxOccupants.other'
                                            : 'rooms.maxOccupants.one',
                                        { count: room.max_occupants },
                                    )}
                                </h2>
                                <Badge
                                    variant="secondary"
                                    className="bg-secondary/60 px-3 py-1 text-sm"
                                >
                                    {t(
                                        `rooms.rentalModeDetail.${room.rental_mode}`,
                                    )}
                                </Badge>
                            </div>

                            <Separator className="bg-border/60" />

                            {room.description && (
                                <div>
                                    <h2 className="mb-4 text-xl font-semibold">
                                        {t('rooms.detail.description')}
                                    </h2>
                                    <p className="text-base leading-relaxed whitespace-pre-wrap text-muted-foreground">
                                        {room.description}
                                    </p>
                                </div>
                            )}

                            <Separator className="bg-border/60" />

                            {room.amenities && (
                                <div>
                                    <h2 className="mb-4 text-xl font-semibold">
                                        {t('rooms.detail.amenities')}
                                    </h2>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {room.amenities
                                            .split(',')
                                            .map((amenity, index) => {
                                                const Icon =
                                                    amenityIcon(amenity);

                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 px-4 py-3"
                                                    >
                                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                                                            <Icon className="size-4.5" />
                                                        </span>
                                                        <span className="text-sm font-medium capitalize">
                                                            {amenity.trim()}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}

                            <Separator className="bg-border/60" />

                            <div>
                                <h2 className="mb-6 text-xl font-semibold">
                                    {t('rooms.availability.heading')}
                                </h2>
                                <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
                                    <RoomAvailabilityCalendar
                                        bookedRanges={bookedRanges}
                                    />
                                </div>
                            </div>

                            {room.recent_reviews.length > 0 && (
                                <>
                                    <Separator className="bg-border/60" />

                                    <div>
                                        <h2 className="mb-4 text-xl font-semibold">
                                            {t('rooms.reviews.heading')}
                                        </h2>
                                        <div className="space-y-5">
                                            {room.recent_reviews.map(
                                                (review) => (
                                                    <div
                                                        key={review.id}
                                                        className="rounded-2xl border border-border/60 bg-card/50 p-4"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                                    {review.guest_name
                                                                        .charAt(
                                                                            0,
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold">
                                                                        {
                                                                            review.guest_name
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {
                                                                            review.created_at
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-0.5">
                                                                {[
                                                                    1, 2, 3, 4,
                                                                    5,
                                                                ].map(
                                                                    (star) => (
                                                                        <Star
                                                                            key={
                                                                                star
                                                                            }
                                                                            className={
                                                                                star <=
                                                                                review.rating
                                                                                    ? 'size-3.5 fill-amber-400 text-amber-400'
                                                                                    : 'size-3.5 text-muted-foreground/30'
                                                                            }
                                                                        />
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                        {review.comment && (
                                                            <p className="mt-3 text-sm text-muted-foreground">
                                                                {review.comment}
                                                            </p>
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right Sticky Sidebar (Booking Widget) */}
                        <div className="relative">
                            <div className="sticky top-28 rounded-[2rem] border border-border/40 bg-card/95 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl transition-all">
                                <div className="mb-6 flex items-end gap-1">
                                    <span className="text-3xl font-bold tracking-tight">
                                        ${room.price_per_night}
                                    </span>
                                    <span className="mb-1 text-sm text-muted-foreground">
                                        {t('rooms.detail.perNight')}
                                    </span>
                                </div>

                                <div className="mb-6 space-y-3 rounded-xl border border-border/50 bg-secondary/20 p-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {t('rooms.detail.monthlyRate')}
                                        </span>
                                        <span className="font-semibold">
                                            ${room.price_per_month}
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full">
                                    {auth.user?.role === 'guest' ? (
                                        <ReservationBookDialog
                                            room={room}
                                            initialType={initialType}
                                            initialCheckInDate={
                                                initialCheckInDate
                                            }
                                            initialCheckOutDate={
                                                initialCheckOutDate
                                            }
                                            initialStartDate={initialStartDate}
                                            initialEndDate={initialEndDate}
                                        />
                                    ) : !auth.user ? (
                                        <Button
                                            asChild
                                            className="h-14 w-full rounded-2xl bg-primary text-base font-bold shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl active:scale-[0.98]"
                                        >
                                            <Link href={login()}>
                                                <LogIn className="size-4" />
                                                {t('nav.logInToBook')}
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button
                                            disabled
                                            className="h-14 w-full rounded-2xl"
                                        >
                                            {t('rooms.detail.staffCannotBook')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
