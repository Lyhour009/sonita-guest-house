import { Form } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import RoomController from '@/actions/App/Http/Controllers/Admin/RoomController';
import RoomForm from '@/components/room-form';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';

export default function RoomCreateDialog() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 size-4" /> {t('adminRooms.addRoom')}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl p-8 sm:max-w-xl lg:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>{t('adminRooms.addRoom')}</DialogTitle>
                </DialogHeader>

                <Form
                    {...RoomController.store.form()}
                    encType="multipart/form-data"
                    onSuccess={() => setOpen(false)}
                    className="space-y-6"
                >
                    {({ processing, errors, isDirty }) => (
                        <>
                            <RoomForm errors={errors} />

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={processing || !isDirty}
                                >
                                    {processing ? (
                                        <Spinner className="mr-2" />
                                    ) : (
                                        <Plus className="mr-2 size-4" />
                                    )}
                                    {t('adminRooms.createRoom')}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
