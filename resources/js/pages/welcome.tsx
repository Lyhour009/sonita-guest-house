import { Head, Link, router } from '@inertiajs/react';
import { BedDouble } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import Pagination from '@/components/pagination';
import PublicHeader from '@/components/public-header';
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
import { DatePicker } from '@/components/ui/date-picker';
import { useTranslation } from '@/hooks/use-translation';
import { home } from '@/routes';
import { show } from '@/routes/rooms';
import type { Paginated, RoomFilters, RoomSummary } from '@/types';

type Props = {
    rooms: Paginated<RoomSummary>;
    filters: RoomFilters;
};

export default function Welcome({ rooms, filters }: Props) {
    const { t } = useTranslation();
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
            <Head title={t('welcome.header.brand')} />
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <div 
                    className="relative h-[65vh] min-h-[500px] w-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/images/hero.jpg')" }}
                >
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                    
                    {/* Header Overlay */}
                    <div className="absolute top-0 left-0 right-0 z-20 p-6 lg:p-10">
                        <PublicHeader className="max-w-6xl mx-auto" left={
                            <div className="text-white drop-shadow-md">
                                <h1 className="text-2xl font-bold tracking-wide">
                                    {t('welcome.header.brand')}
                                </h1>
                            </div>
                        } />
                    </div>

                    {/* Hero Content */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            Discover Your Perfect Stay
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 drop-shadow mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
                            {t('welcome.header.address')} - Experience luxury and comfort in the heart of the city.
                        </p>
                    </div>

                    {/* Glassmorphism Search Bar (Positioned at bottom of Hero) */}
                    <div className="absolute -bottom-16 left-0 right-0 z-30 px-4">
                        <form
                            onSubmit={submitFilters}
                            className="mx-auto flex w-full max-w-5xl flex-wrap items-end gap-4 rounded-3xl border border-white/20 bg-background/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)] dark:bg-zinc-950/80"
                        >
                    <div className="grid gap-1.5">
                        <Label htmlFor="stay_type">
                            {t('rooms.stayType.label')}
                        </Label>
                        <Select value={stayType} onValueChange={setStayType}>
                            <SelectTrigger id="stay_type" className="w-44">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">
                                    {t('rooms.stayType.any')}
                                </SelectItem>
                                <SelectItem value="short_stay">
                                    {t('rooms.stayType.shortStayNightly')}
                                </SelectItem>
                                <SelectItem value="long_stay">
                                    {t('rooms.stayType.longStayMonthly')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-1.5 min-w-44">
                        <Label htmlFor="from">
                            {t('welcome.filters.from')}
                        </Label>
                        <DatePicker
                            id="from"
                            value={from}
                            onChange={setFrom}
                            placeholder={t('welcome.filters.from')}
                        />
                    </div>

                    <div className="grid gap-1.5 min-w-44">
                        <Label htmlFor="to">{t('welcome.filters.to')}</Label>
                        <DatePicker
                            id="to"
                            value={to}
                            onChange={setTo}
                            placeholder={t('welcome.filters.to')}
                        />
                    </div>

                    <Button type="submit" size="lg" className="h-11 rounded-xl px-8 font-semibold shadow-lg transition-transform active:scale-95">
                        {t('common.actions.search')}
                    </Button>
                </form>
            </div>
        </div>

        {/* Room Grid Section */}
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10 pt-32 pb-24">
                    {rooms.data.length === 0 ? (
                        <p className="py-12 text-center text-sm text-muted-foreground">
                            {t('welcome.empty.noResults')}
                        </p>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {rooms.data.map((room, index) => (
                                <Card
                                    key={room.id}
                                    className="group relative flex flex-col overflow-hidden rounded-3xl border-0 bg-card shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="aspect-[4/3] w-full bg-muted relative overflow-hidden flex items-center justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        
                                        {room.thumbnail ? (
                                            <img
                                                src={room.thumbnail}
                                                alt={room.room_type}
                                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-muted-foreground/50 select-none">
                                                <BedDouble className="size-12 stroke-[1] mb-2 opacity-40" />
                                                <span className="text-xs font-medium opacity-60">Sonita Guest House</span>
                                            </div>
                                        )}
                                        
                                        <Badge className="absolute top-4 right-4 z-20 bg-background/90 text-foreground backdrop-blur-md hover:bg-background shadow-sm">
                                            {t(`rooms.rentalModeBadge.${room.rental_mode}`)}
                                        </Badge>
                                    </div>
                                    <CardHeader className="pt-6 pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl font-bold tracking-tight">
                                                {room.room_type}
                                            </CardTitle>
                                            <span className="text-sm font-semibold text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                                                #{room.room_number}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm text-muted-foreground flex-1">
                                        <div className="flex items-end gap-1 mb-2">
                                            <span className="text-2xl font-bold text-foreground">${room.price_per_night}</span>
                                            <span className="mb-1">{t('welcome.card.perNightSuffix')}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span>${room.price_per_month} {t('welcome.card.perMonthSuffix')}</span>
                                            <span className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                                <BedDouble className="size-3.5" />
                                                {t(
                                                    room.max_occupants > 1
                                                        ? 'rooms.maxOccupants.other'
                                                        : 'rooms.maxOccupants.one',
                                                    { count: room.max_occupants },
                                                )}
                                            </span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-4 pb-6 mt-auto">
                                        <Button
                                            asChild
                                            className="w-full rounded-xl h-11 text-sm font-semibold transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                                        >
                                            <Link href={show(room.id)}>
                                                {t('welcome.card.viewRoom')}
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
