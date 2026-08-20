import { router } from '@inertiajs/react';
import type { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { destroy, store } from '@/routes/admin/rooms/images';
import type { RoomImage } from '@/types';

type Props = {
    roomId: string;
    images: RoomImage[];
};

export default function RoomImageManager({ roomId, images }: Props) {
    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files || files.length === 0) {
            return;
        }

        router.post(
            store(roomId).url,
            { images: Array.from(files) },
            {
                forceFormData: true,
                preserveScroll: true,
                preserveState: true,
                only: ['rooms'],
                onFinish: () => {
                    event.target.value = '';
                },
            },
        );
    };

    const handleDelete = (roomImage: RoomImage) => {
        router.delete(destroy({ room: roomId, roomImage: roomImage.id }).url, {
            preserveScroll: true,
            preserveState: true,
            only: ['rooms'],
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((image) => (
                    <div key={image.id} className="group relative">
                        <img
                            src={image.url}
                            alt="Room"
                            className="aspect-square w-full rounded-lg object-cover"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={() => handleDelete(image)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
                {images.length === 0 && (
                    <p className="col-span-full text-sm text-muted-foreground">
                        No images uploaded yet.
                    </p>
                )}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="room_images">Upload images</Label>
                <input
                    id="room_images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUpload}
                    className="text-sm"
                />
            </div>
        </div>
    );
}
