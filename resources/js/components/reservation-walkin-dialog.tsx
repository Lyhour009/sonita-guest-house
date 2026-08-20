import { Form } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import ReservationController from '@/actions/App/Http/Controllers/Staff/ReservationController';
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
import { Switch } from '@/components/ui/switch';
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
    const [open, setOpen] = useState(false);
    const [isNewGuest, setIsNewGuest] = useState(false);
    const [roomId, setRoomId] = useState<string>(rooms[0]?.id ?? '');
    const [type, setType] = useState<ReservationType>('short_stay');

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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>New booking</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>New walk-in booking</DialogTitle>
                </DialogHeader>

                <Form
                    {...ReservationController.store.form()}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-1.5">
                                <Label htmlFor="room_id">Room</Label>
                                <Select
                                    name="room_id"
                                    value={roomId}
                                    onValueChange={setRoomId}
                                >
                                    <SelectTrigger
                                        id="room_id"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rooms.map((room) => (
                                            <SelectItem
                                                key={room.id}
                                                value={room.id}
                                            >
                                                {room.room_number} ·{' '}
                                                {room.room_type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.room_id} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="reservation_type">
                                    Stay type
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
                                        {availableTypes.includes(
                                            'short_stay',
                                        ) && (
                                            <SelectItem value="short_stay">
                                                Short stay (nightly)
                                            </SelectItem>
                                        )}
                                        {availableTypes.includes(
                                            'long_stay',
                                        ) && (
                                            <SelectItem value="long_stay">
                                                Long stay (monthly)
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.reservation_type} />
                            </div>

                            {type === 'short_stay' ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="check_in_date">
                                                Check-in
                                            </Label>
                                            <Input
                                                id="check_in_date"
                                                name="check_in_date"
                                                type="date"
                                                required
                                            />
                                            <InputError
                                                message={errors.check_in_date}
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="check_out_date">
                                                Check-out
                                            </Label>
                                            <Input
                                                id="check_out_date"
                                                name="check_out_date"
                                                type="date"
                                                required
                                            />
                                            <InputError
                                                message={errors.check_out_date}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="num_guests">
                                            Guests
                                        </Label>
                                        <Input
                                            id="num_guests"
                                            name="num_guests"
                                            type="number"
                                            min="1"
                                            max={selectedRoom?.max_occupants}
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
                                            Move-in date
                                        </Label>
                                        <Input
                                            id="start_date"
                                            name="start_date"
                                            type="date"
                                            required
                                        />
                                        <InputError
                                            message={errors.start_date}
                                        />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="end_date">
                                            Move-out date (optional)
                                        </Label>
                                        <Input
                                            id="end_date"
                                            name="end_date"
                                            type="date"
                                        />
                                        <InputError message={errors.end_date} />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <Label htmlFor="is_new_guest">
                                    New guest (no account yet)
                                </Label>
                                <Switch
                                    id="is_new_guest"
                                    checked={isNewGuest}
                                    onCheckedChange={setIsNewGuest}
                                />
                            </div>

                            {isNewGuest ? (
                                <div className="grid gap-4">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="new_guest_full_name">
                                            Guest full name
                                        </Label>
                                        <Input
                                            id="new_guest_full_name"
                                            name="new_guest[full_name]"
                                            required
                                        />
                                        <InputError
                                            message={
                                                errors['new_guest.full_name']
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="new_guest_email">
                                            Guest email
                                        </Label>
                                        <Input
                                            id="new_guest_email"
                                            name="new_guest[email]"
                                            type="email"
                                            required
                                        />
                                        <InputError
                                            message={errors['new_guest.email']}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-1.5">
                                    <Label htmlFor="guest_id">Guest</Label>
                                    <Select name="guest_id">
                                        <SelectTrigger
                                            id="guest_id"
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="Select a guest" />
                                        </SelectTrigger>
                                        <SelectContent>
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

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    Create booking
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
