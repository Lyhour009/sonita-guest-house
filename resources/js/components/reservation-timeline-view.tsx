import { ChevronLeft, ChevronRight, Hotel, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import type {
    StaffReservation,
    TimelineBooking,
    TimelineRoom,
} from '@/types/reservation';

type Props = {
    rooms: TimelineRoom[];
    reservations: StaffReservation[];
    onSelectReservation: (res: StaffReservation) => void;
};

export default function ReservationTimelineView({
    rooms,
    reservations,
    onSelectReservation,
}: Props) {
    const { t } = useTranslation();
    const [startOffset, setStartOffset] = useState<number>(0);

    // Compute the 14-day range based on startOffset
    const days = useMemo(() => {
        const result = [];
        const base = new Date();
        base.setDate(base.getDate() + startOffset - 1); // start from yesterday

        for (let i = 0; i < 14; i++) {
            const d = new Date(base);
            d.setDate(base.getDate() + i);
            const dateString = d.toISOString().split('T')[0];
            const isToday =
                new Date().toISOString().split('T')[0] === dateString;

            result.push({
                date: d,
                dateString,
                dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNum: d.getDate(),
                monthName: d.toLocaleDateString('en-US', { month: 'short' }),
                isToday,
            });
        }

        return result;
    }, [startOffset]);

    const reservationsMap = useMemo(() => {
        return new Map(reservations.map((r) => [r.id, r]));
    }, [reservations]);

    const findReservationObj = (bookingId: string) => {
        return reservationsMap.get(bookingId);
    };

    const getBookingColor = (status: string) => {
        switch (status) {
            case 'checked_in':
            case 'active':
                return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-600/50 shadow-md';
            case 'confirmed':
                return 'bg-gradient-to-r from-primary to-blue-600 text-primary-foreground border-primary/50 shadow-md';
            default:
                return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-600/50 shadow-md';
        }
    };

    return (
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card font-sans shadow-md">
            {/* Timeline Header & Controls */}
            <div className="flex flex-col gap-3 border-b border-border/50 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-foreground">
                        {t('staff.reservations.timeline.title')}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        {t('staff.reservations.timeline.subtitle')}
                    </p>
                </div>

                {/* Date range navigators */}
                <div className="flex items-center gap-1.5">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStartOffset((prev) => prev - 7)}
                        className="h-8 rounded-xl border-border bg-background px-2.5 font-sans text-xs"
                    >
                        <ChevronLeft className="size-4" />
                        <span className="hidden sm:inline">
                            {t('staff.reservations.timeline.previous')}
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStartOffset(0)}
                        className="h-8 rounded-xl border-border bg-background px-3 font-sans text-xs font-semibold"
                    >
                        {t('staff.reservations.timeline.today')}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStartOffset((prev) => prev + 7)}
                        className="h-8 rounded-xl border-border bg-background px-2.5 font-sans text-xs"
                    >
                        <span className="hidden sm:inline">
                            {t('staff.reservations.timeline.next')}
                        </span>
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Visual Timeline Grid with horizontal scroll */}
            <div className="overflow-x-auto">
                <div className="min-w-[960px]">
                    {/* Date Header Row */}
                    <div className="grid grid-cols-[200px_repeat(14,minmax(0,1fr))] border-b border-border bg-muted/40">
                        <div className="flex items-center gap-2 p-3 pl-5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                            <Hotel className="size-4 text-primary" />
                            <span>{t('common.labels.room')}</span>
                        </div>
                        {days.map((day) => (
                            <div
                                key={day.dateString}
                                className={`border-l border-border/50 p-2 text-center text-xs ${
                                    day.isToday ? 'bg-primary/10 font-bold' : ''
                                }`}
                            >
                                <div
                                    className={`text-[10.5px] uppercase ${day.isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}
                                >
                                    {day.dayName}
                                </div>
                                <div
                                    className={`text-xs ${day.isToday ? 'font-extrabold text-primary' : 'font-semibold text-foreground'}`}
                                >
                                    {day.monthName} {day.dayNum}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Room Rows */}
                    <div className="divide-y divide-border/60">
                        {rooms.map((room) => (
                            <div
                                key={room.id}
                                className="grid min-h-13 grid-cols-[200px_repeat(14,minmax(0,1fr))] items-center transition-colors hover:bg-muted/10"
                            >
                                {/* Room Label */}
                                <div className="flex items-center gap-2.5 p-3 pl-5">
                                    <span className="flex size-7.5 items-center justify-center rounded-lg border border-border bg-background text-xs font-bold text-foreground shadow-2xs">
                                        #{room.room_number}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground capitalize">
                                        {room.room_type}
                                    </span>
                                </div>

                                {/* 14 Day Cells */}
                                {days.map((day) => {
                                    // Find if any booking covers this day
                                    const booking = room.bookings.find((b) => {
                                        return (
                                            day.dateString >= b.start_date &&
                                            day.dateString <= b.end_date
                                        );
                                    });

                                    const isStartDay =
                                        booking &&
                                        booking.start_date === day.dateString;
                                    const isEndDay =
                                        booking &&
                                        booking.end_date === day.dateString;

                                    return (
                                        <div
                                            key={day.dateString}
                                            className={`relative flex h-full min-h-13 items-center justify-center border-l border-border/40 p-1 ${
                                                day.isToday
                                                    ? 'bg-primary/5'
                                                    : ''
                                            }`}
                                        >
                                            {booking && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const fullRes =
                                                            findReservationObj(
                                                                booking.id,
                                                            );

                                                        if (fullRes) {
                                                            onSelectReservation(
                                                                fullRes,
                                                            );
                                                        }
                                                    }}
                                                    title={`${booking.guest_name} (${booking.status})`}
                                                    className={`flex h-8 w-full cursor-pointer items-center gap-1 truncate border px-1.5 text-[11px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-lg ${getBookingColor(
                                                        booking.status,
                                                    )} ${isStartDay ? 'rounded-l-xl' : ''} ${
                                                        isEndDay
                                                            ? 'rounded-r-xl'
                                                            : ''
                                                    } ${!isStartDay && !isEndDay ? 'rounded-none' : ''}`}
                                                >
                                                    {isStartDay && (
                                                        <>
                                                            <User className="size-3 shrink-0" />
                                                            <span className="truncate">
                                                                {
                                                                    booking.guest_name
                                                                }
                                                            </span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
