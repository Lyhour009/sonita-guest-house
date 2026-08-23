import { LogIn, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTranslation } from '@/hooks/use-translation';
import { getInitials } from '@/lib/utils';
import type { StaffReservation } from '@/types/reservation';

type Props = {
    arrivals: StaffReservation[];
    departures: StaffReservation[];
    onSelect: (reservation: StaffReservation) => void;
};

function TodayList({
    reservations,
    emptyLabel,
    onSelect,
}: {
    reservations: StaffReservation[];
    emptyLabel: string;
    onSelect: (reservation: StaffReservation) => void;
}) {
    if (reservations.length === 0) {
        return (
            <p className="py-2 font-sans text-xs text-muted-foreground">
                {emptyLabel}
            </p>
        );
    }

    return (
        <div className="space-y-1.5">
            {reservations.map((reservation) => (
                <button
                    key={reservation.id}
                    type="button"
                    onClick={() => onSelect(reservation)}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-muted/60"
                >
                    <Avatar className="size-8 rounded-lg">
                        <AvatarFallback className="rounded-lg bg-primary/10 font-sans text-[11px] font-bold text-primary">
                            {getInitials(reservation.guest.full_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-sans text-xs font-bold text-foreground">
                            {reservation.guest.full_name}
                        </p>
                        <p className="truncate font-sans text-[11px] text-muted-foreground">
                            #{reservation.room.room_number} ·{' '}
                            {reservation.room.room_type}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default function ReservationTodayPanel({
    arrivals,
    departures,
    onSelect,
}: Props) {
    const { t } = useTranslation();

    if (arrivals.length === 0 && departures.length === 0) {
        return null;
    }

    return (
        <div className="grid gap-3 rounded-3xl border border-border/50 bg-card p-4 shadow-sm sm:grid-cols-2">
            <div className="space-y-2 sm:border-r sm:border-border/60 sm:pr-4">
                <div className="flex items-center gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-success/10 text-emerald-600 dark:text-emerald-400">
                        <LogIn className="size-3.5" />
                    </div>
                    <h3 className="font-sans text-xs font-bold tracking-wide text-foreground">
                        {t('staff.reservations.today.arrivalsTitle')} (
                        {arrivals.length})
                    </h3>
                </div>
                <TodayList
                    reservations={arrivals}
                    emptyLabel={t('staff.reservations.today.noArrivals')}
                    onSelect={onSelect}
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <LogOut className="size-3.5" />
                    </div>
                    <h3 className="font-sans text-xs font-bold tracking-wide text-foreground">
                        {t('staff.reservations.today.departuresTitle')} (
                        {departures.length})
                    </h3>
                </div>
                <TodayList
                    reservations={departures}
                    emptyLabel={t('staff.reservations.today.noDepartures')}
                    onSelect={onSelect}
                />
            </div>
        </div>
    );
}
