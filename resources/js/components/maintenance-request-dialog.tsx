import { Form } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import MaintenanceRequestController from '@/actions/App/Http/Controllers/MaintenanceRequestController';
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
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import type { MaintenanceRoomSummary } from '@/types';

type Props = {
    rooms: MaintenanceRoomSummary[];
    /** Custom trigger element (e.g. a compact icon button for a table row). Falls back to the default full-size button. */
    trigger?: ReactNode;
};

export default function MaintenanceRequestDialog({ rooms, trigger }: Props) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [roomId, setRoomId] = useState(rooms[0]?.id ?? '');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button disabled={rooms.length === 0}>
                        {t('maintenance.requestDialog.trigger')}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('maintenance.requestDialog.title')}
                    </DialogTitle>
                </DialogHeader>

                <Form
                    {...MaintenanceRequestController.store.form()}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-1.5">
                                <Label htmlFor="room_id">
                                    {t('common.labels.room')}
                                </Label>
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
                                                {t(
                                                    'maintenance.requestDialog.roomOption',
                                                    {
                                                        roomNumber:
                                                            room.room_number,
                                                    },
                                                )}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.room_id} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="title">
                                    {t('maintenance.requestDialog.titleLabel')}
                                </Label>
                                <Input
                                    id="title"
                                    name="title"
                                    maxLength={255}
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="description">
                                    {t(
                                        'maintenance.requestDialog.descriptionOptional',
                                    )}
                                </Label>
                                <Textarea id="description" name="description" />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="priority">
                                    {t('maintenance.table.priority')}
                                </Label>
                                <Select name="priority" defaultValue="medium">
                                    <SelectTrigger
                                        id="priority"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">
                                            {t(
                                                'common.maintenancePriority.low',
                                            )}
                                        </SelectItem>
                                        <SelectItem value="medium">
                                            {t(
                                                'common.maintenancePriority.medium',
                                            )}
                                        </SelectItem>
                                        <SelectItem value="high">
                                            {t(
                                                'common.maintenancePriority.high',
                                            )}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.priority} />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner className="mr-2" />}
                                    {t('common.actions.submit')}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
