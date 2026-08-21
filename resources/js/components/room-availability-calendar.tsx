import { Calendar } from '@/components/ui/calendar';
import { useTranslation } from '@/hooks/use-translation';

type BookedRange = {
    start: string;
    end: string;
};

type Props = {
    bookedRanges: BookedRange[];
};

export default function RoomAvailabilityCalendar({ bookedRanges }: Props) {
    const { t } = useTranslation();
    const disabled = bookedRanges.map((range) => ({
        from: new Date(`${range.start}T00:00:00`),
        to: new Date(`${range.end}T00:00:00`),
    }));

    return (
        <div>
            <h2 className="mb-3 font-medium">
                {t('rooms.availability.heading')}
            </h2>
            <div className="w-fit rounded-xl border">
                <Calendar
                    numberOfMonths={1}
                    disabled={disabled}
                    className="p-3"
                />
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-block size-3 rounded-sm bg-muted opacity-50" />
                {t('rooms.availability.booked')}
            </div>
        </div>
    );
}
