import { Head, Link, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { dashboard, home, login } from '@/routes';
import { register } from '@/routes';
import type { RoomDetail } from '@/types';

type Props = {
    room: RoomDetail;
};

const rentalModeLabel: Record<RoomDetail['rental_mode'], string> = {
    short_stay: 'Short stay only',
    long_stay: 'Long stay only',
    both: 'Short & long stay',
};

export default function RoomShow({ room }: Props) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title={`${room.room_type} · ${room.room_number}`} />
            <div className="min-h-screen bg-background p-6 lg:p-10">
                <header className="mx-auto mb-8 flex w-full max-w-4xl items-center justify-between">
                    <Link
                        href={home()}
                        className="text-sm text-muted-foreground hover:underline"
                    >
                        ← Back to rooms
                    </Link>
                    <nav className="flex items-center gap-3 text-sm">
                        {auth.user ? (
                            <Button asChild size="sm">
                                <Link href={dashboard()}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={login()}>Log in</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href={register()}>Register</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </header>

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
                                {room.room_type} · Room {room.room_number}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {room.floor ? `Floor ${room.floor} · ` : ''}
                                Up to {room.max_occupants} guest
                                {room.max_occupants > 1 ? 's' : ''}
                            </p>
                        </div>
                        <Badge variant="secondary">
                            {rentalModeLabel[room.rental_mode]}
                        </Badge>
                    </div>

                    <Separator />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Per night
                            </p>
                            <p className="text-xl font-semibold">
                                ${room.price_per_night}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Per month
                            </p>
                            <p className="text-xl font-semibold">
                                ${room.price_per_month}
                            </p>
                        </div>
                    </div>

                    {room.description && (
                        <div>
                            <h2 className="mb-1 font-medium">Description</h2>
                            <p className="text-sm text-muted-foreground">
                                {room.description}
                            </p>
                        </div>
                    )}

                    {room.amenities && (
                        <div>
                            <h2 className="mb-1 font-medium">Amenities</h2>
                            <p className="text-sm text-muted-foreground">
                                {room.amenities}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
