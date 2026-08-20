import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { RoomDetail, RoomStatus, RentalMode } from '@/types';

type Props = {
    room?: RoomDetail;
    errors: Partial<Record<string, string>>;
};

export default function RoomForm({ room, errors }: Props) {
    return (
        <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid gap-2">
                <Label htmlFor="room_number">Room number</Label>
                <Input
                    id="room_number"
                    name="room_number"
                    defaultValue={room?.room_number}
                    required
                />
                <InputError message={errors.room_number} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="room_type">Room type</Label>
                <Input
                    id="room_type"
                    name="room_type"
                    defaultValue={room?.room_type}
                    placeholder="Standard, Deluxe, Suite..."
                    required
                />
                <InputError message={errors.room_type} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="rental_mode">Rental mode</Label>
                <Select
                    name="rental_mode"
                    defaultValue={
                        (room?.rental_mode ?? 'both') satisfies RentalMode
                    }
                >
                    <SelectTrigger id="rental_mode" className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="short_stay">
                            Short stay only
                        </SelectItem>
                        <SelectItem value="long_stay">
                            Long stay only
                        </SelectItem>
                        <SelectItem value="both">Short & long stay</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.rental_mode} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                    name="status"
                    defaultValue={
                        (room?.status ?? 'available') satisfies RoomStatus
                    }
                >
                    <SelectTrigger id="status" className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.status} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="price_per_night">Price per night ($)</Label>
                <Input
                    id="price_per_night"
                    name="price_per_night"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={room?.price_per_night}
                    required
                />
                <InputError message={errors.price_per_night} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="price_per_month">Price per month ($)</Label>
                <Input
                    id="price_per_month"
                    name="price_per_month"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={room?.price_per_month}
                    required
                />
                <InputError message={errors.price_per_month} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="floor">Floor</Label>
                <Input
                    id="floor"
                    name="floor"
                    type="number"
                    defaultValue={room?.floor ?? undefined}
                />
                <InputError message={errors.floor} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="max_occupants">Max occupants</Label>
                <Input
                    id="max_occupants"
                    name="max_occupants"
                    type="number"
                    min="1"
                    defaultValue={room?.max_occupants ?? 1}
                    required
                />
                <InputError message={errors.max_occupants} />
            </div>

            <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="amenities">Amenities</Label>
                <Textarea
                    id="amenities"
                    name="amenities"
                    defaultValue={room?.amenities ?? undefined}
                    placeholder="Wi-Fi, Air conditioning, Hot water..."
                />
                <InputError message={errors.amenities} />
            </div>

            <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    defaultValue={room?.description ?? undefined}
                />
                <InputError message={errors.description} />
            </div>
        </div>
    );
}
