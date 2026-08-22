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
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import ReservationDateFields from './reservation-date-fields';
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
    const todayString = new Date().toISOString().split('T')[0];

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
            <DialogContent className="max-h-[85vh] overflow-y-auto">
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
                                        <SelectContent portaled={false}>
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

                            <ReservationDateFields
                                type={type}
                                checkInDate={checkInDate}
                                setCheckInDate={setCheckInDate}
                                checkOutDate={checkOutDate}
                                setCheckOutDate={setCheckOutDate}
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                                setNumGuests={type === 'short_stay' ? () => {} : undefined} // Mock for book dialog to render input, not select
                                maxOccupants={room.max_occupants}
                                errors={errors}
                            />

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
