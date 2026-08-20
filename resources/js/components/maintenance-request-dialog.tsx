import { Form } from '@inertiajs/react';
import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import type { MaintenanceRoomSummary } from '@/types';

type Props = {
    rooms: MaintenanceRoomSummary[];
};

export default function MaintenanceRequestDialog({ rooms }: Props) {
    const [open, setOpen] = useState(false);
    const [roomId, setRoomId] = useState(rooms[0]?.id ?? '');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={rooms.length === 0}>Report an issue</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report a maintenance issue</DialogTitle>
                </DialogHeader>

                <Form
                    {...MaintenanceRequestController.store.form()}
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
                                                Room {room.room_number}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.room_id} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="title">Title</Label>
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
                                    Description (optional)
                                </Label>
                                <Textarea id="description" name="description" />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="priority">Priority</Label>
                                <Select name="priority" defaultValue="medium">
                                    <SelectTrigger
                                        id="priority"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="high">
                                            High
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.priority} />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    Submit
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
