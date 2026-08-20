import { Head, Link, router, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard, home, login } from '@/routes';
import { register } from '@/routes';
import { show } from '@/routes/rooms';
import type { Paginated, RoomFilters, RoomSummary } from '@/types';

type Props = {
    rooms: Paginated<RoomSummary>;
    filters: RoomFilters;
};

export default function Welcome({ rooms, filters }: Props) {
    const { auth } = usePage().props;
    const [stayType, setStayType] = useState(filters.stay_type ?? 'any');
    const [from, setFrom] = useState(filters.from ?? '');
    const [to, setTo] = useState(filters.to ?? '');

    const submitFilters = (event: FormEvent) => {
        event.preventDefault();

        router.get(
            home().url,
            {
                stay_type: stayType === 'any' ? undefined : stayType,
                from: from || undefined,
                to: to || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Rooms" />
            <div className="min-h-screen bg-background p-6 lg:p-10">
                <header className="mx-auto mb-8 flex w-full max-w-6xl items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">
                            Sonita Guest House
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Street 644, Sangkat Chak Angre Ti 1, Khan Chak
                            Angre, Phnom Penh
                        </p>
                    </div>
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

                <form
                    onSubmit={submitFilters}
                    className="mx-auto mb-8 flex w-full max-w-6xl flex-wrap items-end gap-4 rounded-xl border p-4"
                >
                    <div className="grid gap-1.5">
                        <Label htmlFor="stay_type">Stay type</Label>
                        <Select value={stayType} onValueChange={setStayType}>
                            <SelectTrigger id="stay_type" className="w-44">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="short_stay">
                                    Short stay (nightly)
                                </SelectItem>
                                <SelectItem value="long_stay">
                                    Long stay (monthly)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="from">From</Label>
                        <input
                            id="from"
                            type="date"
                            value={from}
                            onChange={(event) => setFrom(event.target.value)}
                            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                        />
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="to">To</Label>
                        <input
                            id="to"
                            type="date"
                            value={to}
                            onChange={(event) => setTo(event.target.value)}
                            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                        />
                    </div>

                    <Button type="submit">Search</Button>
                </form>

                <div className="mx-auto w-full max-w-6xl">
                    {rooms.data.length === 0 ? (
                        <p className="py-12 text-center text-sm text-muted-foreground">
                            No rooms match your search.
                        </p>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {rooms.data.map((room) => (
                                <Card
                                    key={room.id}
                                    className="overflow-hidden py-0"
                                >
                                    <div className="aspect-video w-full bg-muted">
                                        {room.thumbnail && (
                                            <img
                                                src={room.thumbnail}
                                                alt={room.room_type}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <CardHeader className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <CardTitle>
                                                {room.room_type} ·{' '}
                                                {room.room_number}
                                            </CardTitle>
                                            <Badge variant="secondary">
                                                {room.rental_mode === 'both'
                                                    ? 'Short & long stay'
                                                    : room.rental_mode ===
                                                        'short_stay'
                                                      ? 'Short stay'
                                                      : 'Long stay'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-1 text-sm text-muted-foreground">
                                        <p>${room.price_per_night} / night</p>
                                        <p>${room.price_per_month} / month</p>
                                        <p>
                                            Up to {room.max_occupants} guest
                                            {room.max_occupants > 1 ? 's' : ''}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="pb-6">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <Link href={show(room.id)}>
                                                View room
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                    <div className="mt-8">
                        <Pagination meta={rooms} />
                    </div>
                </div>
            </div>
        </>
    );
}
