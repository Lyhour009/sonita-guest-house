import { router } from '@inertiajs/react';
import type { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { usePendingAction } from '@/hooks/use-pending-action';
import { useTranslation } from '@/hooks/use-translation';
import { destroy, store } from '@/routes/admin/rooms/images';
import type { RoomImage } from '@/types';

type Props = {
    roomId: string;
    images: RoomImage[];
};

const UPLOAD_KEY = 'upload';

export default function RoomImageManager({ roomId, images }: Props) {
    const { t } = useTranslation();
    const { isPending, withPending } = usePendingAction();

    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files || files.length === 0) {
            return;
        }

        router.post(
            store(roomId).url,
            { images: Array.from(files) },
            withPending(UPLOAD_KEY, {
                forceFormData: true,
                preserveScroll: true,
                preserveState: true,
                only: ['rooms'],
                onFinish: () => {
                    event.target.value = '';
                },
            }),
        );
    };

    const handleDelete = (roomImage: RoomImage) => {
        router.delete(
            destroy({ room: roomId, roomImage: roomImage.id }).url,
            withPending(roomImage.id, {
                preserveScroll: true,
                preserveState: true,
                only: ['rooms'],
            }),
        );
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((image) => (
                    <div key={image.id} className="group relative">
                        <img
                            src={image.url}
                            alt={t('common.labels.room')}
                            className="aspect-square w-full rounded-lg object-cover"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
                            disabled={isPending(image.id)}
                            onClick={() => handleDelete(image)}
                        >
                            {isPending(image.id) && (
                                <Spinner className="mr-2" />
                            )}
                            {t('adminRooms.imageManager.remove')}
                        </Button>
                    </div>
                ))}
                {images.length === 0 && (
                    <p className="col-span-full text-sm text-muted-foreground">
                        {t('adminRooms.imageManager.noImages')}
                    </p>
                )}
            </div>
        </div>
    );
}
