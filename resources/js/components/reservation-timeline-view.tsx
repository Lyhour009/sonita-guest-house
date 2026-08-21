import { ChevronLeft, ChevronRight, Hotel, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import type { StaffReservation, TimelineBooking, TimelineRoom } from '@/types/reservation';

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
            const isToday = new Date().toISOString().split('T')[0] === dateString;

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
                return 'bg-emerald-500/90 text-white border-emerald-600';
            case 'confirmed':
                return 'bg-primary text-primary-foreground border-primary/80';
            default:
                return 'bg-amber-500/90 text-white border-amber-600';
        }
    };

    return (
        <div className="rounded-2xl border border-border/80 bg-card shadow-2xs overflow-hidden font-sans">
            {/* Timeline Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-border/70 gap-3 bg-muted/20">
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
                        className="h-8 rounded-xl px-2.5 text-xs font-sans border-border bg-background"
                    >
                        <ChevronLeft className="size-4" />
                        <span className="hidden sm:inline">{t('staff.reservations.timeline.previous')}</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStartOffset(0)}
                        className="h-8 rounded-xl px-3 text-xs font-sans border-border bg-background font-semibold"
                    >
                        {t('staff.reservations.timeline.today')}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStartOffset((prev) => prev + 7)}
                        className="h-8 rounded-xl px-2.5 text-xs font-sans border-border bg-background"
                    >
                        <span className="hidden sm:inline">{t('staff.reservations.timeline.next')}</span>
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Visual Timeline Grid with horizontal scroll */}
            <div className="overflow-x-auto">
                <div className="min-w-[960px]">
                    {/* Date Header Row */}
                    <div className="grid grid-cols-[200px_repeat(14,minmax(0,1fr))] border-b border-border bg-muted/40">
                        <div className="p-3 text-xs font-bold text-muted-foreground uppercase tracking-wider pl-5 flex items-center gap-2">
                            <Hotel className="size-4 text-primary" />
                            <span>Room</span>
                        </div>
                        {days.map((day) => (
                            <div
                                key={day.dateString}
                                className={`p-2 text-center border-l border-border/50 text-xs ${
                                    day.isToday ? 'bg-primary/10 font-bold' : ''
                                }`}
                            >
                                <div className={`text-[10.5px] uppercase ${day.isToday ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                                    {day.dayName}
                                </div>
                                <div className={`text-xs ${day.isToday ? 'text-primary font-extrabold' : 'text-foreground font-semibold'}`}>
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
                                className="grid grid-cols-[200px_repeat(14,minmax(0,1fr))] min-h-13 items-center transition-colors hover:bg-muted/10"
                            >
                                {/* Room Label */}
                                <div className="p-3 pl-5 flex items-center gap-2.5">
                                    <span className="flex size-7.5 items-center justify-center rounded-lg border border-border bg-background font-bold text-xs text-foreground shadow-2xs">
                                        #{room.room_number}
                                    </span>
                                    <span className="text-xs text-muted-foreground capitalize truncate">
                                        {room.room_type}
                                    </span>
                                </div>

                                {/* 14 Day Cells */}
                                {days.map((day) => {
                                    // Find if any booking covers this day
                                    const booking = room.bookings.find((b) => {
                                        return day.dateString >= b.start_date && day.dateString <= b.end_date;
                                    });

                                    const isStartDay = booking && booking.start_date === day.dateString;
                                    const isEndDay = booking && booking.end_date === day.dateString;

                                    return (
                                        <div
                                            key={day.dateString}
                                            className={`h-full min-h-13 border-l border-border/40 p-1 flex items-center justify-center relative ${
                                                day.isToday ? 'bg-primary/5' : ''
                                            }`}
                                        >
                                            {booking && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const fullRes = findReservationObj(booking.id);
                                                        if (fullRes) onSelectReservation(fullRes);
                                                    }}
                                                    title={`${booking.guest_name} (${booking.status})`}
                                                    className={`w-full h-8 px-1.5 flex items-center gap-1 text-[11px] font-semibold truncate transition-transform hover:scale-[1.03] cursor-pointer shadow-2xs border ${
                                                        getBookingColor(booking.status)
                                                    } ${isStartDay ? 'rounded-l-lg' : ''} ${
                                                        isEndDay ? 'rounded-r-lg' : ''
                                                    } ${!isStartDay && !isEndDay ? 'rounded-none' : ''}`}
                                                >
                                                    {isStartDay && (
                                                        <>
                                                            <User className="size-3 shrink-0" />
                                                            <span className="truncate">{booking.guest_name}</span>
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
