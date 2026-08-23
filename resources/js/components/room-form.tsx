import { ImagePlus, X } from 'lucide-react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import InputError from '@/components/input-error';
import RoomImageManager from '@/components/room-image-manager';
import { Button } from '@/components/ui/button';
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
import { useTranslation } from '@/hooks/use-translation';
import type { RoomDetail, RoomStatus, RentalMode } from '@/types';

type Props = {
    room?: RoomDetail;
    /** Prefill values for a brand-new room (e.g. duplicating an existing one). Never used for `room_number` or images. */
    initialData?: Partial<RoomDetail>;
    errors: Partial<Record<string, string>>;
};

export default function RoomForm({ room, initialData, errors }: Props) {
    const { t } = useTranslation();
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || files.length === 0) {
            setPreviewUrls([]);

            return;
        }

        const urls = Array.from(files).map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    return (
        <div className="flex flex-col gap-8 md:flex-row">
            {/* Left side: Form fields */}
            <div className="grid flex-1 gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="room_number">
                        {t('adminRooms.form.roomNumber')}
                    </Label>
                    <Input
                        id="room_number"
                        name="room_number"
                        defaultValue={room?.room_number}
                        required
                    />
                    <InputError message={errors.room_number} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="room_type">
                        {t('adminRooms.form.roomType')}
                    </Label>
                    <Input
                        id="room_type"
                        name="room_type"
                        defaultValue={room?.room_type ?? initialData?.room_type}
                        placeholder={t('adminRooms.form.roomTypePlaceholder')}
                        required
                    />
                    <InputError message={errors.room_type} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="rental_mode">
                        {t('adminRooms.filters.rentalMode')}
                    </Label>
                    <Select
                        name="rental_mode"
                        defaultValue={
                            (room?.rental_mode ??
                                initialData?.rental_mode ??
                                'both') satisfies RentalMode
                        }
                    >
                        <SelectTrigger id="rental_mode" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent portaled={false}>
                            <SelectItem value="short_stay">
                                {t('adminRooms.form.rentalModeShortStayOnly')}
                            </SelectItem>
                            <SelectItem value="long_stay">
                                {t('adminRooms.form.rentalModeLongStayOnly')}
                            </SelectItem>
                            <SelectItem value="both">
                                {t('adminRooms.form.rentalModeBoth')}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.rental_mode} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="status">{t('common.labels.status')}</Label>
                    <Select
                        name="status"
                        defaultValue={
                            (room?.status ?? 'available') satisfies RoomStatus
                        }
                    >
                        <SelectTrigger id="status" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent portaled={false}>
                            <SelectItem value="available">
                                {t('common.roomStatus.available')}
                            </SelectItem>
                            <SelectItem value="occupied">
                                {t('common.roomStatus.occupied')}
                            </SelectItem>
                            <SelectItem value="reserved">
                                {t('common.roomStatus.reserved')}
                            </SelectItem>
                            <SelectItem value="cleaning">
                                {t('common.roomStatus.cleaning')}
                            </SelectItem>
                            <SelectItem value="maintenance">
                                {t('common.roomStatus.maintenance')}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.status} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="price_per_night">
                        {t('adminRooms.form.pricePerNight')}
                    </Label>
                    <Input
                        id="price_per_night"
                        name="price_per_night"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={
                            room?.price_per_night ??
                            initialData?.price_per_night
                        }
                        required
                    />
                    <InputError message={errors.price_per_night} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="price_per_month">
                        {t('adminRooms.form.pricePerMonth')}
                    </Label>
                    <Input
                        id="price_per_month"
                        name="price_per_month"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={
                            room?.price_per_month ??
                            initialData?.price_per_month
                        }
                        required
                    />
                    <InputError message={errors.price_per_month} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="floor">{t('adminRooms.form.floor')}</Label>
                    <Input
                        id="floor"
                        name="floor"
                        type="number"
                        defaultValue={
                            room?.floor ?? initialData?.floor ?? undefined
                        }
                    />
                    <InputError message={errors.floor} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="max_occupants">
                        {t('adminRooms.form.maxOccupants')}
                    </Label>
                    <Input
                        id="max_occupants"
                        name="max_occupants"
                        type="number"
                        min="1"
                        defaultValue={
                            room?.max_occupants ??
                            initialData?.max_occupants ??
                            1
                        }
                        required
                    />
                    <InputError message={errors.max_occupants} />
                </div>

                <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="amenities">
                        {t('adminRooms.form.amenities')}
                    </Label>
                    <Textarea
                        id="amenities"
                        name="amenities"
                        defaultValue={
                            room?.amenities ??
                            initialData?.amenities ??
                            undefined
                        }
                        placeholder={t('adminRooms.form.amenitiesPlaceholder')}
                    />
                    <InputError message={errors.amenities} />
                </div>

                <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="description">
                        {t('adminRooms.form.description')}
                    </Label>
                    <Textarea
                        id="description"
                        name="description"
                        defaultValue={
                            room?.description ??
                            initialData?.description ??
                            undefined
                        }
                    />
                    <InputError message={errors.description} />
                </div>

                <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="notes">{t('adminRooms.form.notes')}</Label>
                    <Textarea
                        id="notes"
                        name="notes"
                        defaultValue={room?.notes ?? undefined}
                        placeholder={t('adminRooms.form.notesPlaceholder')}
                    />
                    <InputError message={errors.notes} />
                </div>
            </div>

            {/* Right side: Sticky Image Upload */}
            <div className="w-full shrink-0 space-y-4 md:w-[320px]">
                <div className="sticky top-0 rounded-2xl border border-border/50 bg-muted/30 p-5">
                    <Label
                        htmlFor="room_images"
                        className="mb-4 block text-base font-semibold"
                    >
                        {t('adminRooms.images')}
                    </Label>

                    {room && room.images && room.images.length > 0 && (
                        <div className="mb-6">
                            <RoomImageManager
                                roomId={room.id}
                                images={room.images}
                            />
                            <div className="my-4 h-px bg-border/50" />
                        </div>
                    )}

                    <div className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-background p-8 text-center transition-all hover:border-primary/50 hover:bg-muted/40">
                        <div className="mb-3 rounded-full bg-primary/5 p-4 transition-transform group-hover:scale-110">
                            <ImagePlus className="size-8 text-primary" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                            {t('adminRooms.imageManager.upload')}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            JPG, PNG, WebP up to 5MB
                        </p>
                        <input
                            id="room_images"
                            name="images[]"
                            type="file"
                            multiple
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handleFileChange}
                            className="absolute inset-0 cursor-pointer opacity-0"
                        />
                    </div>

                    {previewUrls.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {previewUrls.map((url, idx) => (
                                <div
                                    key={idx}
                                    className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted shadow-sm"
                                >
                                    <img
                                        src={url}
                                        alt={`Preview ${idx + 1}`}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <InputError message={errors.images} className="mt-2" />
                </div>
            </div>
        </div>
    );
}
