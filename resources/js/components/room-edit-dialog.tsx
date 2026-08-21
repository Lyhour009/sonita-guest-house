import { Form } from '@inertiajs/react';
import RoomController from '@/actions/App/Http/Controllers/Admin/RoomController';
import RoomForm from '@/components/room-form';
import RoomImageManager from '@/components/room-image-manager';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import type { RoomDetail } from '@/types';

type Props = {
    room: RoomDetail | null;
    onOpenChange: (open: boolean) => void;
};

export default function RoomEditDialog({ room, onOpenChange }: Props) {
    const { t } = useTranslation();

    return (
        <Dialog open={room !== null} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {t('adminRooms.editRoom', {
                            roomNumber: room?.room_number ?? '',
                        })}
                    </DialogTitle>
                </DialogHeader>

                {room && (
                    <>
                        <Form
                            {...RoomController.update.form(room.id)}
                            encType="multipart/form-data"
                            onSuccess={() => onOpenChange(false)}
                            className="space-y-6"
                        >
                            {({ processing, errors, isDirty }) => (
                                <>
                                    <RoomForm room={room} errors={errors} />

                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            disabled={processing || !isDirty}
                                        >
                                            {processing && (
                                                <Spinner className="mr-2" />
                                            )}
                                            {t('common.actions.saveChanges')}
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">
                                {t('adminRooms.images')}
                            </h3>
                            <RoomImageManager
                                roomId={room.id}
                                images={room.images}
                            />
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
