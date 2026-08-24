import { Form, Head, Link, router } from '@inertiajs/react';
import { addDays, format, parseISO } from 'date-fns';
import {
    ArrowRight,
    BedDouble,
    BellRing,
    Check,
    Home,
    MapPin,
    Moon,
    Search,
    Star,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import WaitlistController from '@/actions/App/Http/Controllers/WaitlistController';
import InputError from '@/components/input-error';
import Pagination from '@/components/pagination';
import PublicHeader from '@/components/public-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { home } from '@/routes';
import { show } from '@/routes/rooms';
import type { PaginatedResource, RoomFilters, RoomSummary } from '@/types';

type StayMode = 'short_stay' | 'long_stay';

type Props = {
    rooms: PaginatedResource<RoomSummary>;
    filters: RoomFilters;
};

/** The API rejects `to` unless it is strictly after `from`, so the end picker starts a day later. */
function dayAfter(date: string): string | undefined {
    if (!date) {
        return undefined;
    }

    try {
        return format(addDays(parseISO(date), 1), 'yyyy-MM-dd');
    } catch {
        return undefined;
    }
}

export default function Welcome({ rooms, filters }: Props) {
    const { t } = useTranslation();

    const startedLong = filters.stay_type === 'long_stay';
    const [stayType, setStayType] = useState<StayMode>(
        filters.stay_type ?? 'short_stay',
    );
    const [shortFrom, setShortFrom] = useState(
        startedLong ? '' : (filters.from ?? ''),
    );
    const [shortTo, setShortTo] = useState(
        startedLong ? '' : (filters.to ?? ''),
    );
    const [longFrom, setLongFrom] = useState(
        startedLong ? (filters.from ?? '') : '',
    );
    const [longTo, setLongTo] = useState(startedLong ? (filters.to ?? '') : '');

    const submit = (mode: StayMode) => {
        setStayType(mode);

        const from = mode === 'short_stay' ? shortFrom : longFrom;
        const to = mode === 'short_stay' ? shortTo : longTo;

        router.get(
            home().url,
            {
                stay_type: mode,
                from: from || undefined,
                to: to || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const isShort = stayType === 'short_stay';

    return (
        <>
            <Head title={t('welcome.header.brand')} />

            <div className="min-h-screen bg-background">
                {/* ---------- Hero ---------- */}
                <div className="relative h-[55vh] min-h-[450px] w-full overflow-hidden rounded-b-[3rem] bg-cover bg-center bg-no-repeat lg:h-[65vh]">
                    <img
                        src="/images/hero.jpg"
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 size-full object-cover"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70"
                    />

                    <div className="relative z-20 px-6 pt-6 lg:px-10">
                        <PublicHeader
                            overlay
                            className="mx-auto max-w-6xl"
                            left={
                                <div className="flex items-center gap-2.5">
                                    <span className="flex size-9 items-center justify-center rounded-lg border border-white/25 bg-white/15 backdrop-blur-sm">
                                        <BedDouble className="size-5 text-white" />
                                    </span>
                                    <span className="text-lg font-semibold tracking-wide text-white drop-shadow-sm">
                                        {t('welcome.header.brand')}
                                    </span>
                                </div>
                            }
                        />
                    </div>

                    {/*
                     * bottom-24 keeps the copy clear of the stay panels, which are
                     * pulled up 56px (-mt-14) over the bottom of the hero.
                     * Leading stays generous: Khmer stacks subscript consonants below
                     * the baseline and clips at the tighter display line-heights.
                     */}
                    <div className="absolute inset-x-0 bottom-24 z-10 px-6 lg:px-10">
                        <div className="mx-auto flex max-w-6xl flex-col gap-2">
                            <p className="flex items-center gap-1.5 text-sm leading-relaxed font-medium text-white/85">
                                <MapPin className="size-4 shrink-0" />
                                {t('welcome.header.address')}
                            </p>
                            <h1 className="max-w-2xl text-3xl leading-[1.4] font-bold text-pretty text-white drop-shadow-md md:text-[2.5rem]">
                                {t('welcome.hero.headline')}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* ---------- The fork: nightly vs monthly ---------- */}
                <div className="relative z-30 mx-auto max-w-6xl px-6 lg:px-10">
                    <div className="-mt-24 grid gap-6 md:grid-cols-2">
                        <StayPanel
                            active={isShort}
                            icon={<Moon className="size-5" />}
                            title={t('welcome.stay.short.title')}
                            billing={t('welcome.stay.short.billing')}
                            selectedLabel={t('welcome.stay.selected')}
                            onSelect={() => setStayType('short_stay')}
                        >
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Field
                                    id="short_from"
                                    label={t('welcome.stay.short.checkIn')}
                                >
                                    <DatePicker
                                        id="short_from"
                                        value={shortFrom}
                                        onChange={setShortFrom}
                                        minDate={format(
                                            new Date(),
                                            'yyyy-MM-dd',
                                        )}
                                        placeholder={t(
                                            'welcome.stay.short.checkIn',
                                        )}
                                    />
                                </Field>
                                <Field
                                    id="short_to"
                                    label={t('welcome.stay.short.checkOut')}
                                >
                                    <DatePicker
                                        id="short_to"
                                        value={shortTo}
                                        onChange={setShortTo}
                                        minDate={dayAfter(shortFrom)}
                                        placeholder={t(
                                            'welcome.stay.short.checkOut',
                                        )}
                                    />
                                </Field>
                            </div>

                            <Button
                                type="button"
                                size="lg"
                                className="h-11 w-full rounded-xl font-semibold sm:w-auto sm:self-end"
                                onClick={() => submit('short_stay')}
                            >
                                <Search className="size-4" />
                                {t('welcome.stay.short.action')}
                            </Button>
                        </StayPanel>

                        <StayPanel
                            active={!isShort}
                            icon={<Home className="size-5" />}
                            title={t('welcome.stay.long.title')}
                            billing={t('welcome.stay.long.billing')}
                            selectedLabel={t('welcome.stay.selected')}
                            onSelect={() => setStayType('long_stay')}
                        >
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Field
                                    id="long_from"
                                    label={t('welcome.stay.long.moveIn')}
                                >
                                    <DatePicker
                                        id="long_from"
                                        value={longFrom}
                                        onChange={setLongFrom}
                                        minDate={format(
                                            new Date(),
                                            'yyyy-MM-dd',
                                        )}
                                        placeholder={t(
                                            'welcome.stay.long.moveIn',
                                        )}
                                    />
                                </Field>
                                <Field
                                    id="long_to"
                                    label={t('welcome.stay.long.until')}
                                >
                                    <DatePicker
                                        id="long_to"
                                        value={longTo}
                                        onChange={setLongTo}
                                        minDate={dayAfter(longFrom)}
                                        placeholder={t(
                                            'welcome.stay.long.until',
                                        )}
                                    />
                                </Field>
                            </div>

                            <Button
                                type="button"
                                size="lg"
                                variant={isShort ? 'outline' : 'default'}
                                className="h-11 w-full rounded-xl font-semibold sm:w-auto sm:self-end"
                                onClick={() => submit('long_stay')}
                            >
                                <Search className="size-4" />
                                {t('welcome.stay.long.action')}
                            </Button>
                        </StayPanel>
                    </div>
                </div>

                {/* ---------- Results ---------- */}
                <div className="mx-auto w-full max-w-6xl px-6 pt-12 pb-20 lg:px-10">
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                        <h2 className="text-2xl font-bold tracking-tight">
                            {t('welcome.results.heading')}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {t(
                                rooms.meta.total === 1
                                    ? 'welcome.results.countOne'
                                    : 'welcome.results.countOther',
                                { count: rooms.meta.total },
                            )}
                        </p>
                    </div>

                    {rooms.data.length === 0 ? (
                        <div className="py-16">
                            <p className="mb-6 text-center text-sm text-muted-foreground">
                                {t('welcome.empty.noResults')}
                            </p>
                            <WaitlistForm
                                stayType={stayType}
                                from={isShort ? shortFrom : longFrom}
                                to={isShort ? shortTo : longTo}
                            />
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {rooms.data.map((room) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    stayType={stayType}
                                    from={isShort ? shortFrom : longFrom}
                                    to={isShort ? shortTo : longTo}
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-10">
                        <Pagination meta={rooms} />
                    </div>
                </div>
            </div>
        </>
    );
}

function WaitlistForm({
    stayType,
    from,
    to,
}: {
    stayType: StayMode;
    from: string;
    to: string;
}) {
    const { t } = useTranslation();

    return (
        <div className="mx-auto max-w-md space-y-4 rounded-3xl border border-border/50 bg-card p-6 text-center shadow-sm">
            <div className="flex justify-center">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <BellRing className="size-5" />
                </span>
            </div>
            <div>
                <h3 className="text-base font-bold">
                    {t('welcome.waitlist.title')}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t('welcome.waitlist.description')}
                </p>
            </div>

            <Form
                {...WaitlistController.store.form()}
                className="space-y-3 text-left"
            >
                {({ processing, errors, isDirty, wasSuccessful }) => (
                    <>
                        <input
                            type="hidden"
                            name="stay_type"
                            value={stayType}
                        />
                        {from && (
                            <input
                                type="hidden"
                                name="from_date"
                                value={from}
                            />
                        )}
                        {to && (
                            <input type="hidden" name="to_date" value={to} />
                        )}

                        <div className="grid gap-1.5">
                            <Label
                                htmlFor="waitlist_email"
                                className="text-[13px]"
                            >
                                {t('welcome.waitlist.emailLabel')}
                            </Label>
                            <Input
                                id="waitlist_email"
                                name="email"
                                type="email"
                                required
                                placeholder={t(
                                    'welcome.waitlist.emailPlaceholder',
                                )}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label
                                htmlFor="waitlist_phone"
                                className="text-[13px]"
                            >
                                {t('welcome.waitlist.phoneLabel')}
                            </Label>
                            <Input
                                id="waitlist_phone"
                                name="phone_number"
                                placeholder={t(
                                    'welcome.waitlist.phonePlaceholder',
                                )}
                            />
                            <InputError message={errors.phone_number} />
                        </div>

                        <Button
                            type="submit"
                            disabled={processing || !isDirty}
                            className="w-full rounded-xl font-semibold"
                        >
                            {processing ? (
                                <Spinner className="mr-2" />
                            ) : (
                                <BellRing className="mr-2 size-4" />
                            )}
                            {t('welcome.waitlist.submit')}
                        </Button>

                        {wasSuccessful && (
                            <p className="text-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                {t('welcome.waitlist.success')}
                            </p>
                        )}
                    </>
                )}
            </Form>
        </div>
    );
}

function Field({
    id,
    label,
    children,
}: {
    id: string;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="grid gap-1.5">
            <Label htmlFor={id} className="text-[13px]">
                {label}
            </Label>
            {children}
        </div>
    );
}

function StayPanel({
    active,
    icon,
    title,
    billing,
    selectedLabel,
    onSelect,
    children,
}: {
    active: boolean;
    icon: React.ReactNode;
    title: string;
    billing: string;
    selectedLabel: string;
    onSelect: () => void;
    children: React.ReactNode;
}) {
    return (
        <div
            className={cn(
                'flex flex-col gap-4 rounded-3xl bg-card/95 p-6 backdrop-blur-xl transition-all duration-300 md:p-8',
                active
                    ? 'z-10 scale-[1.02] border-2 border-primary shadow-2xl'
                    : 'border border-border/50 opacity-90 shadow-lg hover:opacity-100 hover:shadow-xl',
            )}
        >
            <button
                type="button"
                onClick={onSelect}
                aria-pressed={active}
                className="flex items-start justify-between gap-3 rounded-lg text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
                <span className="flex items-center gap-3">
                    <span
                        className={cn(
                            'flex size-12 shrink-0 items-center justify-center rounded-2xl',
                            active
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'bg-secondary text-secondary-foreground',
                        )}
                    >
                        {icon}
                    </span>
                    <span className="flex flex-col">
                        <span className="text-base font-bold">{title}</span>
                        <span className="text-[13px] leading-snug text-muted-foreground">
                            {billing}
                        </span>
                    </span>
                </span>

                {active && (
                    <Badge className="shrink-0 gap-1">
                        <Check className="size-3" />
                        {selectedLabel}
                    </Badge>
                )}
            </button>

            {children}
        </div>
    );
}

function RoomCard({
    room,
    stayType,
    from,
    to,
}: {
    room: RoomSummary;
    stayType: StayMode;
    from: string;
    to: string;
}) {
    const { t } = useTranslation();

    const supportsLong =
        room.rental_mode === 'long_stay' || room.rental_mode === 'both';
    const supportsShort =
        room.rental_mode === 'short_stay' || room.rental_mode === 'both';

    // Lead with the price for the stay the visitor actually chose.
    const leadMonthly =
        stayType === 'long_stay' ? supportsLong : !supportsShort;

    const leadPrice = leadMonthly ? room.price_per_month : room.price_per_night;
    const leadSuffix = leadMonthly
        ? t('welcome.card.perMonthSuffix')
        : t('welcome.card.perNightSuffix');

    let secondary: string;

    if (room.rental_mode === 'both') {
        secondary = leadMonthly
            ? t('welcome.card.orPerNight', {
                  price: `$${room.price_per_night}`,
              })
            : t('welcome.card.orPerMonth', {
                  price: `$${room.price_per_month}`,
              });
    } else {
        secondary = leadMonthly
            ? t('welcome.card.monthlyOnly')
            : t('welcome.card.nightlyOnly');
    }

    return (
        <div className="group flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                {room.thumbnail ? (
                    <img
                        src={room.thumbnail}
                        alt={room.room_type}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-1.5 bg-secondary">
                        <BedDouble className="size-8 stroke-[1.1] text-muted-foreground/55" />
                        <span className="text-xs font-medium text-muted-foreground/80">
                            {t('welcome.card.noPhoto')}
                        </span>
                    </div>
                )}

                <Badge
                    variant="secondary"
                    className="absolute top-3 right-3 bg-background/90 text-foreground shadow-sm backdrop-blur-sm"
                >
                    {t(`rooms.rentalModeBadge.${room.rental_mode}`)}
                </Badge>
            </div>

            <div className="flex flex-1 flex-col gap-3.5 p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold tracking-tight">
                        {room.room_type}
                    </h3>
                    <span className="text-sm font-medium text-muted-foreground">
                        #{room.room_number}
                    </span>
                </div>

                {room.reviews_count > 0 && (
                    <p className="-mt-2 flex items-center gap-1 text-[13px] font-semibold text-foreground">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        {room.average_rating}
                        <span className="font-normal text-muted-foreground">
                            (
                            {t(
                                room.reviews_count === 1
                                    ? 'rooms.reviews.countOne'
                                    : 'rooms.reviews.countOther',
                                { count: room.reviews_count },
                            )}
                            )
                        </span>
                    </p>
                )}

                <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                    <Users className="size-4 shrink-0" />
                    {t(
                        room.max_occupants > 1
                            ? 'rooms.maxOccupants.other'
                            : 'rooms.maxOccupants.one',
                        { count: room.max_occupants },
                    )}
                </p>

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3.5">
                    <div className="flex flex-col">
                        <span className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold tracking-tight">
                                ${leadPrice}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {leadSuffix}
                            </span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {secondary}
                        </span>
                    </div>

                    <Button
                        asChild
                        className="rounded-xl font-bold shadow-sm transition-all hover:scale-105"
                    >
                        <Link
                            href={show(room.id, {
                                query: {
                                    stay_type: stayType,
                                    from: from || undefined,
                                    to: to || undefined,
                                },
                            })}
                        >
                            {t('welcome.card.viewRoom')}
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
