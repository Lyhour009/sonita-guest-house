import { Form } from '@inertiajs/react';
import { useState } from 'react';
import ReservationController from '@/actions/App/Http/Controllers/ReservationController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import type { ReservationType, RoomDetail } from '@/types';

type Props = {
    room: RoomDetail;
};

export default function ReservationBookDialog({ room }: Props) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<ReservationType>(
        room.rental_mode === 'long_stay' ? 'long_stay' : 'short_stay',
    );
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const availableTypes: ReservationType[] =
        room.rental_mode === 'both'
            ? ['short_stay', 'long_stay']
            : [room.rental_mode as ReservationType];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full">
                    {t('reservations.bookDialog.trigger')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('reservations.bookDialog.title', {
                            roomNumber: room.room_number,
                        })}
                    </DialogTitle>
                </DialogHeader>

                <Form
                    {...ReservationController.store.form()}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <input
                                type="hidden"
                                name="room_id"
                                value={room.id}
                            />

                            {availableTypes.length > 1 && (
                                <div className="grid gap-1.5">
                                    <Label htmlFor="reservation_type">
                                        {t('rooms.stayType.label')}
                                    </Label>
                                    <Select
                                        name="reservation_type"
                                        value={type}
                                        onValueChange={(value) =>
                                            setType(value as ReservationType)
                                        }
                                    >
                                        <SelectTrigger
                                            id="reservation_type"
                                            className="w-full"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="short_stay">
                                                {t(
                                                    'rooms.stayType.shortStayNightly',
                                                )}
                                            </SelectItem>
                                            <SelectItem value="long_stay">
                                                {t(
                                                    'rooms.stayType.longStayMonthly',
                                                )}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={errors.reservation_type}
                                    />
                                </div>
                            )}
                            {availableTypes.length === 1 && (
                                <input
                                    type="hidden"
                                    name="reservation_type"
                                    value={type}
                                />
                            )}

                            {type === 'short_stay' ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="check_in_date">
                                                {t(
                                                    'reservations.bookDialog.checkIn',
                                                )}
                                            </Label>
                                            <DatePicker
                                                id="check_in_date"
                                                name="check_in_date"
                                                value={checkInDate}
                                                onChange={setCheckInDate}
                                                required
                                            />
                                            <InputError
                                                message={errors.check_in_date}
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="check_out_date">
                                                {t(
                                                    'reservations.bookDialog.checkOut',
                                                )}
                                            </Label>
                                            <DatePicker
                                                id="check_out_date"
                                                name="check_out_date"
                                                value={checkOutDate}
                                                onChange={setCheckOutDate}
                                                minDate={checkInDate}
                                                required
                                            />
                                            <InputError
                                                message={errors.check_out_date}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="num_guests">
                                            {t(
                                                'reservations.bookDialog.guests',
                                            )}
                                        </Label>
                                        <Input
                                            id="num_guests"
                                            name="num_guests"
                                            type="number"
                                            min="1"
                                            max={room.max_occupants}
                                            defaultValue={1}
                                            required
                                        />
                                        <InputError
                                            message={errors.num_guests}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="start_date">
                                            {t(
                                                'reservations.bookDialog.moveInDate',
                                            )}
                                        </Label>
                                        <DatePicker
                                            id="start_date"
                                            name="start_date"
                                            value={startDate}
                                            onChange={setStartDate}
                                            required
                                        />
                                        <InputError
                                            message={errors.start_date}
                                        />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="end_date">
                                            {t(
                                                'reservations.bookDialog.moveOutDateOptional',
                                            )}
                                        </Label>
                                        <DatePicker
                                            id="end_date"
                                            name="end_date"
                                            value={endDate}
                                            onChange={setEndDate}
                                            minDate={startDate}
                                        />
                                        <InputError message={errors.end_date} />
                                    </div>
                                </div>
                            )}

                            <InputError message={errors.room_id} />

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner className="mr-2" />}
                                    {t('reservations.bookDialog.submit')}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
