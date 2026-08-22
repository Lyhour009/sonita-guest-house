import { Head, Link, usePage } from '@inertiajs/react';
import PublicHeader from '@/components/public-header';
import ReservationBookDialog from '@/components/reservation-book-dialog';
import RoomAvailabilityCalendar from '@/components/room-availability-calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BedDouble, Check, MapPin, Star, Wifi } from 'lucide-react';
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

                <div className="mx-auto w-full max-w-6xl space-y-6">
                    {/* Header Title above gallery */}
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                                {t('rooms.detail.heading', {
                                    type: room.room_type,
                                    number: room.room_number,
                                })}
                            </h1>
                            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground font-medium">
                                <span className="flex items-center gap-1">
                                    <MapPin className="size-4 text-primary" />
                                    {t('welcome.header.address')}
                                </span>
                                <span>·</span>
                                <span>
                                    {room.floor ? `${t('rooms.detail.floor', { floor: room.floor })}` : 'Ground Floor'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Airbnb Style Photo Gallery */}
                    <div className="grid h-[50vh] min-h-[400px] max-h-[600px] gap-2 grid-cols-4 grid-rows-2 rounded-3xl overflow-hidden shadow-sm">
                        {room.images && room.images.length > 0 ? (
                            <>
                                <div className="col-span-4 sm:col-span-2 row-span-2 relative group overflow-hidden bg-muted">
                                    <img
                                        src={room.images[0].url}
                                        alt={`${room.room_type} main view`}
                                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                                {room.images.slice(1, 5).map((image, index) => (
                                    <div key={image.id} className="hidden sm:block relative group overflow-hidden bg-muted">
                                        <img
                                            src={image.url}
                                            alt={`${room.room_type} view ${index + 2}`}
                                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                    </div>
                                ))}
                                {/* Fill remaining slots if < 5 images */}
                                {Array.from({ length: Math.max(0, 4 - (room.images.length - 1)) }).map((_, i) => (
                                    <div key={`empty-${i}`} className="hidden sm:block bg-muted/30" />
                                ))}
                            </>
                        ) : (
                            <div className="col-span-4 row-span-2 bg-muted flex items-center justify-center text-muted-foreground">
                                <BedDouble className="size-16 opacity-30 mb-2" />
                            </div>
                        )}
                    </div>

                    <div className="grid lg:grid-cols-[1fr_380px] gap-12 mt-10">
                        {/* Left Content Column */}
                        <div className="space-y-10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    {t(
                                        room.max_occupants > 1
                                            ? 'rooms.maxOccupants.other'
                                            : 'rooms.maxOccupants.one',
                                        { count: room.max_occupants },
                                    )}
                                </h2>
                                <Badge variant="secondary" className="px-3 py-1 text-sm bg-secondary/60">
                                    {t(`rooms.rentalModeDetail.${room.rental_mode}`)}
                                </Badge>
                            </div>

                            <Separator className="bg-border/60" />

                            {room.description && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">
                                        {t('rooms.detail.description')}
                                    </h2>
                                    <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {room.description}
                                    </p>
                                </div>
                            )}

                            <Separator className="bg-border/60" />

                            {room.amenities && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">
                                        {t('rooms.detail.amenities')}
                                    </h2>
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                        {room.amenities.split(',').map((amenity, index) => (
                                            <div key={index} className="flex items-center gap-3 text-muted-foreground">
                                                <Check className="size-5 text-emerald-500" />
                                                <span className="capitalize">{amenity.trim()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Separator className="bg-border/60" />

                            <div>
                                <h2 className="text-xl font-semibold mb-6">
                                    Availability
                                </h2>
                                <div className="rounded-2xl border border-border/60 p-4 bg-card/50">
                                    <RoomAvailabilityCalendar bookedRanges={bookedRanges} />
                                </div>
                            </div>
                        </div>

                        {/* Right Sticky Sidebar (Booking Widget) */}
                        <div className="relative">
                            <div className="sticky top-24 rounded-3xl border border-border/50 bg-card p-6 shadow-2xl shadow-primary/5">
                                <div className="mb-6 flex items-end gap-1">
                                    <span className="text-3xl font-bold tracking-tight">${room.price_per_night}</span>
                                    <span className="text-sm text-muted-foreground mb-1">{t('rooms.detail.perNight')}</span>
                                </div>

                                <div className="rounded-xl border border-border/50 bg-secondary/20 p-4 mb-6 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Monthly Rate</span>
                                        <span className="font-semibold">${room.price_per_month}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Cleaning Fee</span>
                                        <span className="font-semibold">$0</span>
                                    </div>
                                </div>

                                <div className="w-full">
                                    {auth.user?.role === 'guest' ? (
                                        <ReservationBookDialog room={room} />
                                    ) : !auth.user ? (
                                        <Button asChild className="w-full h-12 text-base rounded-xl font-bold bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                            <Link href={login()}>
                                                {t('nav.logInToBook')}
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button disabled className="w-full h-12 rounded-xl">
                                            Staff cannot book
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
