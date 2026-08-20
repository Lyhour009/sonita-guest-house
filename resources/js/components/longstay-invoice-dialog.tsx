import { Form } from '@inertiajs/react';
import { useState } from 'react';
import InvoiceController from '@/actions/App/Http/Controllers/Admin/InvoiceController';
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
import type { ActiveLongStayReservationOption } from '@/types';

type Props = {
    reservations: ActiveLongStayReservationOption[];
};

export default function LongStayInvoiceDialog({ reservations }: Props) {
    const [open, setOpen] = useState(false);
    const [reservationId, setReservationId] = useState(
        reservations[0]?.id ?? '',
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={reservations.length === 0}>
                    Generate invoice
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate long-stay invoice</DialogTitle>
                </DialogHeader>

                <Form
                    {...InvoiceController.store.form()}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-1.5">
                                <Label htmlFor="reservation_id">Tenant</Label>
                                <Select
                                    name="reservation_id"
                                    value={reservationId}
                                    onValueChange={setReservationId}
                                >
                                    <SelectTrigger
                                        id="reservation_id"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {reservations.map((reservation) => (
                                            <SelectItem
                                                key={reservation.id}
                                                value={reservation.id}
                                            >
                                                {reservation.guest_name} · Room{' '}
                                                {reservation.room_number}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.reservation_id} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="billing_period">
                                    Billing month (optional, defaults to current
                                    month)
                                </Label>
                                <Input
                                    id="billing_period"
                                    name="billing_period"
                                    type="date"
                                />
                                <InputError message={errors.billing_period} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="elec_meter_start">
                                        Electric meter start
                                    </Label>
                                    <Input
                                        id="elec_meter_start"
                                        name="elec_meter_start"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                    <InputError
                                        message={errors.elec_meter_start}
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="elec_meter_end">
                                        Electric meter end
                                    </Label>
                                    <Input
                                        id="elec_meter_end"
                                        name="elec_meter_end"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                    <InputError
                                        message={errors.elec_meter_end}
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="water_meter_start">
                                        Water meter start
                                    </Label>
                                    <Input
                                        id="water_meter_start"
                                        name="water_meter_start"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                    <InputError
                                        message={errors.water_meter_start}
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="water_meter_end">
                                        Water meter end
                                    </Label>
                                    <Input
                                        id="water_meter_end"
                                        name="water_meter_end"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                    <InputError
                                        message={errors.water_meter_end}
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    Generate
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
