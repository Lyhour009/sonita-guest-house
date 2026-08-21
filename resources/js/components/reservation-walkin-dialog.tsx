import { Form } from '@inertiajs/react';
import { BedDouble, CheckCircle2, Plus, User, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import ReservationController from '@/actions/App/Http/Controllers/Staff/ReservationController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/hooks/use-translation';
import type {
    ReservationGuestSummary,
    ReservationType,
    RoomOption,
} from '@/types';

type Props = {
    guests: ReservationGuestSummary[];
    rooms: RoomOption[];
};

export default function ReservationWalkinDialog({ guests, rooms }: Props) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [type, setType] = useState<ReservationType>('short_stay');
    const [checkInDate, setCheckInDate] = useState<string>('');
    const [checkOutDate, setCheckOutDate] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isNewGuest, setIsNewGuest] = useState(false);

    const selectedRoom = useMemo(
        () => rooms.find((room) => room.id === roomId),
        [rooms, roomId],
    );

    const availableTypes: ReservationType[] = useMemo(() => {
        if (!selectedRoom || selectedRoom.rental_mode === 'both') {
            return ['short_stay', 'long_stay'];
        }

        return [selectedRoom.rental_mode as ReservationType];
    }, [selectedRoom]);

    const resetFormState = () => {
        setRoomId('');
        setType('short_stay');
        setCheckInDate('');
        setCheckOutDate('');
        setStartDate('');
        setEndDate('');
        setIsNewGuest(false);
    };

    const todayString = new Date().toISOString().split('T')[0];

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) resetFormState();
            }}
        >
            <DialogTrigger asChild>
                <Button className="h-10 cursor-pointer gap-2 rounded-xl bg-primary px-4 font-sans text-sm font-semibold text-primary-foreground shadow-2xs">
                    <Plus className="size-4" />
                    {t('staff.walkinDialog.newBooking')}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl p-6 font-sans sm:max-w-2xl md:max-w-3xl">
                <DialogHeader className="space-y-1 border-b border-border/80 pb-2">
                    <DialogTitle className="flex items-center gap-2 font-sans text-xl font-bold text-foreground">
                        <UserPlus className="size-5 text-primary" />
                        {t('staff.walkinDialog.title')}
                    </DialogTitle>
                    <DialogDescription className="font-sans text-xs text-muted-foreground">
                        {t('staff.walkinDialog.subtitle')}
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...ReservationController.store.form()}
                    onSuccess={() => {
                        setOpen(false);
                        resetFormState();
                    }}
                    className="space-y-6 pt-2"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Section 1: Stay & Room Assignment */}
                            <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
                                <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                    <BedDouble className="size-3.5 text-primary" />
                                    {t('staff.reservations.details.stayInfo')}
                                </h4>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Room Select */}
                                    <div className="grid gap-1.5">
                                        <Label
                                            htmlFor="room_id"
                                            className="text-xs font-semibold"
                                        >
                                            {t('staff.walkinDialog.roomLabel')}{' '}
                                            *
                                        </Label>
                                        <Select
                                            name="room_id"
                                            value={roomId}
                                            onValueChange={(val) => {
                                                setRoomId(val);
                                                const found = rooms.find(
                                                    (r) => r.id === val,
                                                );
                                                if (
                                                    found &&
                                                    found.rental_mode !== 'both'
                                                ) {
                                                    setType(
                                                        found.rental_mode as ReservationType,
                                                    );
                                                }
                                            }}
                                        >
                                            <SelectTrigger
                                                id="room_id"
                                                className="h-10 w-full rounded-xl border-border bg-background"
                                            >
                                                <SelectValue placeholder="Select available room" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[100] rounded-xl border-border">
                                                {rooms.map((room) => (
                                                    <SelectItem
                                                        key={room.id}
                                                        value={room.id}
                                                    >
                                                        #{room.room_number} ·{' '}
                                                        {room.room_type} (
                                                        {room.rental_mode})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.room_id} />
                                    </div>

                                    {/* Stay Type */}
                                    <div className="grid gap-1.5">
                                        <Label
                                            htmlFor="reservation_type"
                                            className="text-xs font-semibold"
                                        >
                                            {t(
                                                'staff.walkinDialog.stayTypeLabel',
                                            )}{' '}
                                            *
                                        </Label>
                                        <Select
                                            name="reservation_type"
                                            value={type}
                                            onValueChange={(value) =>
                                                setType(
                                                    value as ReservationType,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="reservation_type"
                                                className="h-10 w-full rounded-xl border-border bg-background"
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="z-[100] rounded-xl border-border">
                                                {availableTypes.includes(
                                                    'short_stay',
                                                ) && (
                                                    <SelectItem value="short_stay">
                                                        {t(
                                                            'staff.walkinDialog.shortStayOption',
                                                        )}
                                                    </SelectItem>
                                                )}
                                                {availableTypes.includes(
                                                    'long_stay',
                                                ) && (
                                                    <SelectItem value="long_stay">
                                                        {t(
                                                            'staff.walkinDialog.longStayOption',
                                                        )}
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.reservation_type}
                                        />
                                    </div>
                                </div>

                                {/* Dates & Guests Matrix */}
                                {type === 'short_stay' ? (
                                    <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-3">
                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="check_in_date"
                                                className="text-xs font-semibold"
                                            >
                                                {t(
                                                    'staff.walkinDialog.checkInLabel',
                                                )}{' '}
                                                *
                                            </Label>
                                            <Input
                                                id="check_in_date"
                                                name="check_in_date"
                                                type="date"
                                                min={todayString}
                                                value={checkInDate}
                                                onChange={(e) =>
                                                    setCheckInDate(
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-10 cursor-pointer rounded-xl border-border bg-background font-sans"
                                                required
                                            />
                                            <InputError
                                                message={errors.check_in_date}
                                            />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="check_out_date"
                                                className="text-xs font-semibold"
                                            >
                                                {t(
                                                    'staff.walkinDialog.checkOutLabel',
                                                )}{' '}
                                                *
                                            </Label>
                                            <Input
                                                id="check_out_date"
                                                name="check_out_date"
                                                type="date"
                                                min={checkInDate || todayString}
                                                value={checkOutDate}
                                                onChange={(e) =>
                                                    setCheckOutDate(
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-10 cursor-pointer rounded-xl border-border bg-background font-sans"
                                                required
                                            />
                                            <InputError
                                                message={errors.check_out_date}
                                            />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="num_guests"
                                                className="text-xs font-semibold"
                                            >
                                                {t(
                                                    'staff.walkinDialog.numGuestsLabel',
                                                )}
                                            </Label>
                                            <Input
                                                id="num_guests"
                                                name="num_guests"
                                                type="number"
                                                min="1"
                                                max={
                                                    selectedRoom?.max_occupants ??
                                                    10
                                                }
                                                defaultValue={1}
                                                className="h-10 rounded-xl border-border bg-background font-sans"
                                                required
                                            />
                                            <InputError
                                                message={errors.num_guests}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="start_date"
                                                className="text-xs font-semibold"
                                            >
                                                {t(
                                                    'staff.walkinDialog.moveInDateLabel',
                                                )}{' '}
                                                *
                                            </Label>
                                            <Input
                                                id="start_date"
                                                name="start_date"
                                                type="date"
                                                min={todayString}
                                                value={startDate}
                                                onChange={(e) =>
                                                    setStartDate(e.target.value)
                                                }
                                                className="h-10 cursor-pointer rounded-xl border-border bg-background font-sans"
                                                required
                                            />
                                            <InputError
                                                message={errors.start_date}
                                            />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="end_date"
                                                className="text-xs font-semibold"
                                            >
                                                {t(
                                                    'staff.walkinDialog.moveOutDateLabel',
                                                )}
                                            </Label>
                                            <Input
                                                id="end_date"
                                                name="end_date"
                                                type="date"
                                                min={startDate || todayString}
                                                value={endDate}
                                                onChange={(e) =>
                                                    setEndDate(e.target.value)
                                                }
                                                className="h-10 cursor-pointer rounded-xl border-border bg-background font-sans"
                                            />
                                            <InputError
                                                message={errors.end_date}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 2: Guest Details */}
                            <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
                                <div className="flex items-center justify-between">
                                    <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        <User className="size-3.5 text-primary" />
                                        {t(
                                            'staff.reservations.details.guestInfo',
                                        )}
                                    </h4>

                                    {/* New Guest Switch */}
                                    <div className="flex items-center gap-2">
                                        <Label
                                            htmlFor="is_new_guest"
                                            className="cursor-pointer text-xs font-medium"
                                        >
                                            {t(
                                                'staff.walkinDialog.isNewGuestLabel',
                                            )}
                                        </Label>
                                        <Switch
                                            id="is_new_guest"
                                            checked={isNewGuest}
                                            onCheckedChange={setIsNewGuest}
                                        />
                                    </div>
                                </div>

                                {isNewGuest ? (
                                    <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="new_guest_full_name"
                                                className="text-xs font-semibold"
                                            >
                                                {t(
                                                    'staff.walkinDialog.fullNameLabel',
                                                )}{' '}
                                                *
                                            </Label>
                                            <Input
                                                id="new_guest_full_name"
                                                name="new_guest[full_name]"
                                                placeholder="e.g. John Smith"
                                                className="h-10 rounded-xl border-border bg-background"
                                                required
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        'new_guest.full_name'
                                                    ]
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="new_guest_email"
                                                className="text-xs font-semibold"
                                            >
                                                {t(
                                                    'staff.walkinDialog.emailLabel',
                                                )}{' '}
                                                *
                                            </Label>
                                            <Input
                                                id="new_guest_email"
                                                name="new_guest[email]"
                                                type="email"
                                                placeholder="e.g. john@example.com"
                                                className="h-10 rounded-xl border-border bg-background"
                                                required
                                            />
                                            <InputError
                                                message={
                                                    errors['new_guest.email']
                                                }
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-1.5 pt-1">
                                        <Label
                                            htmlFor="guest_id"
                                            className="text-xs font-semibold"
                                        >
                                            {t(
                                                'staff.walkinDialog.guestSelectLabel',
                                            )}{' '}
                                            *
                                        </Label>
                                        <Select name="guest_id">
                                            <SelectTrigger
                                                id="guest_id"
                                                className="h-10 w-full rounded-xl border-border bg-background"
                                            >
                                                <SelectValue
                                                    placeholder={t(
                                                        'staff.walkinDialog.selectGuestPlaceholder',
                                                    )}
                                                />
                                            </SelectTrigger>
                                            <SelectContent
                                                side="top"
                                                align="start"
                                                className="z-[100] max-h-48 rounded-xl border-border shadow-xl"
                                            >
                                                {guests.map((guest) => (
                                                    <SelectItem
                                                        key={guest.id}
                                                        value={guest.id}
                                                    >
                                                        {guest.full_name} (
                                                        {guest.email})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.guest_id} />
                                    </div>
                                )}
                            </div>

                            {/* Section 3: Footer & Submit */}
                            <DialogFooter className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="h-11 cursor-pointer rounded-xl border-border px-5 font-sans text-sm hover:bg-muted"
                                >
                                    {t('staff.walkinDialog.cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-11 cursor-pointer gap-2 rounded-xl bg-primary px-6 font-sans text-sm font-semibold text-primary-foreground shadow-2xs"
                                >
                                    {processing ? (
                                        <Spinner className="size-4.5" />
                                    ) : (
                                        <CheckCircle2 className="size-4.5" />
                                    )}
                                    {processing
                                        ? t('staff.walkinDialog.creating')
                                        : t('staff.walkinDialog.submit')}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
