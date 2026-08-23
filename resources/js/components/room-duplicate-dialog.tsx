import { Form } from '@inertiajs/react';
import { Copy } from 'lucide-react';
import RoomController from '@/actions/App/Http/Controllers/Admin/RoomController';
import RoomForm from '@/components/room-form';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import type { RoomDetail } from '@/types';

type Props = {
    room: RoomDetail | null;
    onOpenChange: (open: boolean) => void;
};

export default function RoomDuplicateDialog({ room, onOpenChange }: Props) {
    const { t } = useTranslation();

    return (
        <Dialog open={room !== null} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl p-8 sm:max-w-xl lg:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>
                        {t('adminRooms.duplicateRoom', {
                            roomNumber: room?.room_number ?? '',
                        })}
                    </DialogTitle>
                </DialogHeader>

                {room && (
                    <Form
                        {...RoomController.store.form()}
                        encType="multipart/form-data"
                        onSuccess={() => onOpenChange(false)}
                        className="space-y-6"
                    >
                        {({ processing, errors, isDirty }) => (
                            <>
                                <RoomForm initialData={room} errors={errors} />

                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={processing || !isDirty}
                                    >
                                        {processing ? (
                                            <Spinner className="mr-2" />
                                        ) : (
                                            <Copy className="mr-2 size-4" />
                                        )}
                                        {t('adminRooms.createRoom')}
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
