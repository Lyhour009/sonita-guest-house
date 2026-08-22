import InputError from '@/components/input-error';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import type { ReservationType } from '@/types';


type Props = {
    type: ReservationType;
    checkInDate: string;
    setCheckInDate: (date: string) => void;
    checkOutDate: string;
    setCheckOutDate: (date: string) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
    numGuests?: string;
    setNumGuests?: (num: string) => void;
    maxOccupants?: number;
    errors: Partial<Record<string, string>>;
    isStaffView?: boolean;
};

export default function ReservationDateFields({
    type,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    numGuests,
    setNumGuests,
    maxOccupants = 10,
    errors,
    isStaffView = false,
}: Props) {
    const { t } = useTranslation();
    const todayString = new Date().toISOString().split('T')[0];

    const labelClass = isStaffView ? 'text-xs font-semibold' : '';
    const gridCols = isStaffView ? 'sm:grid-cols-3' : 'grid-cols-2';
    const gridColsLong = isStaffView ? 'sm:grid-cols-2' : 'grid-cols-2';
    const inputClass = isStaffView ? 'h-10 rounded-xl border-border bg-background' : '';

    return (
        <>
            {type === 'short_stay' ? (
                <>
                    <div className={`grid grid-cols-1 gap-4 ${isStaffView ? 'pt-1' : ''} ${gridCols}`}>
                        <div className="grid gap-1.5">
                            <Label htmlFor="check_in_date" className={labelClass}>
                                {isStaffView
                                    ? t('staff.walkinDialog.checkInLabel') + ' *'
                                    : t('reservations.bookDialog.checkIn')}
                            </Label>
                            <DatePicker
                                id="check_in_date"
                                name="check_in_date"
                                minDate={todayString}
                                value={checkInDate}
                                onChange={setCheckInDate}
                                portaled={false}
                                required
                            />
                            <InputError message={errors.check_in_date} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="check_out_date" className={labelClass}>
                                {isStaffView
                                    ? t('staff.walkinDialog.checkOutLabel') + ' *'
                                    : t('reservations.bookDialog.checkOut')}
                            </Label>
                            <DatePicker
                                id="check_out_date"
                                name="check_out_date"
                                value={checkOutDate}
                                onChange={setCheckOutDate}
                                minDate={checkInDate || todayString}
                                portaled={false}
                                required
                            />
                            <InputError message={errors.check_out_date} />
                        </div>

                        {setNumGuests && (
                            <div className="grid gap-1.5">
                                <Label htmlFor="num_guests" className={labelClass}>
                                    {isStaffView
                                        ? t('staff.walkinDialog.numGuestsLabel')
                                        : t('reservations.bookDialog.guests')}
                                </Label>
                                {isStaffView ? (
                                    <Select
                                        name="num_guests"
                                        value={numGuests}
                                        onValueChange={setNumGuests}
                                        required
                                    >
                                        <SelectTrigger id="num_guests" className={inputClass}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent portaled={false} className="z-[100] max-h-48 rounded-xl border-border shadow-xl">
                                            {Array.from(
                                                { length: maxOccupants },
                                                (_, i) => i + 1,
                                            ).map((num) => (
                                                <SelectItem key={num} value={num.toString()}>
                                                    {num}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        id="num_guests"
                                        name="num_guests"
                                        type="number"
                                        min="1"
                                        max={maxOccupants}
                                        defaultValue={1}
                                        required
                                    />
                                )}
                                <InputError message={errors.num_guests} />
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className={`grid grid-cols-1 gap-4 ${isStaffView ? 'pt-1' : ''} ${gridColsLong}`}>
                    <div className="grid gap-1.5">
                        <Label htmlFor="start_date" className={labelClass}>
                            {isStaffView
                                ? t('staff.walkinDialog.moveInDateLabel') + ' *'
                                : t('reservations.bookDialog.moveInDate')}
                        </Label>
                        <DatePicker
                            id="start_date"
                            name="start_date"
                            minDate={todayString}
                            value={startDate}
                            onChange={setStartDate}
                            portaled={false}
                            required
                        />
                        <InputError message={errors.start_date} />
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="end_date" className={labelClass}>
                            {isStaffView
                                ? t('staff.walkinDialog.moveOutDateLabel')
                                : t('reservations.bookDialog.moveOutDateOptional')}
                        </Label>
                        <DatePicker
                            id="end_date"
                            name="end_date"
                            value={endDate}
                            onChange={setEndDate}
                            minDate={startDate || todayString}
                            portaled={false}
                        />
                        <InputError message={errors.end_date} />
                    </div>
                </div>
            )}
        </>
    );
}
