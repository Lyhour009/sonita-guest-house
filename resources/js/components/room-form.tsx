import { ImagePlus, X } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import InputError from '@/components/input-error';
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
    errors: Partial<Record<string, string>>;
};

export default function RoomForm({ room, errors }: Props) {
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
        <div className="grid gap-6 sm:grid-cols-2">
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
                    defaultValue={room?.room_type}
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
                        (room?.rental_mode ?? 'both') satisfies RentalMode
                    }
                >
                    <SelectTrigger id="rental_mode" className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                    <SelectContent>
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
                    defaultValue={room?.price_per_night}
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
                    defaultValue={room?.price_per_month}
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
                    defaultValue={room?.floor ?? undefined}
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
                    defaultValue={room?.max_occupants ?? 1}
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
                    defaultValue={room?.amenities ?? undefined}
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
                    defaultValue={room?.description ?? undefined}
                />
                <InputError message={errors.description} />
            </div>

            {/* Room Images Upload Section */}
            <div className="grid gap-3 sm:col-span-2">
                <Label htmlFor="room_images" className="text-sm font-semibold">
                    {t('adminRooms.images')}
                </Label>

                <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/20 p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/40">
                    <ImagePlus className="mb-2 size-8 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">
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
                    <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
                        {previewUrls.map((url, idx) => (
                            <div key={idx} className="relative aspect-video overflow-hidden rounded-lg border border-border bg-muted shadow-2xs">
                                <img
                                    src={url}
                                    alt={`Preview ${idx + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}
                <InputError message={errors.images} />
            </div>
        </div>
    );
}
