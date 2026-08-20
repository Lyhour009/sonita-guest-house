import { Form } from '@inertiajs/react';
import { useState } from 'react';
import PaymentController from '@/actions/App/Http/Controllers/PaymentController';
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
import type { Invoice } from '@/types';

type Props = {
    invoice: Invoice;
};

export default function PaymentSubmitDialog({ invoice }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">Pay</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Pay invoice · {invoice.room.room_number}
                    </DialogTitle>
                </DialogHeader>

                <Form
                    {...PaymentController.store.form()}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <input
                                type="hidden"
                                name="invoice_id"
                                value={invoice.id}
                            />

                            <div className="grid gap-1.5">
                                <Label htmlFor="amount">Amount ($)</Label>
                                <Input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    defaultValue={invoice.outstanding_balance}
                                    required
                                />
                                <InputError message={errors.amount} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="method">Payment method</Label>
                                <Select name="method" defaultValue="cash">
                                    <SelectTrigger
                                        id="method"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">
                                            Cash
                                        </SelectItem>
                                        <SelectItem value="bank_transfer">
                                            Bank transfer
                                        </SelectItem>
                                        <SelectItem value="qr">
                                            QR payment
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.method} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="proof_image">
                                    Proof of payment (optional)
                                </Label>
                                <input
                                    id="proof_image"
                                    name="proof_image"
                                    type="file"
                                    accept="image/*"
                                    className="text-sm"
                                />
                                <InputError message={errors.proof_image} />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    Submit payment
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
