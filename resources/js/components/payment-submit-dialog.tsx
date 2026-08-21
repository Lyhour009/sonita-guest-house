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
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import type { Invoice } from '@/types';

type Props = {
    invoice: Invoice;
};

export default function PaymentSubmitDialog({ invoice }: Props) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">{t('payments.submitDialog.trigger')}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('payments.submitDialog.title', {
                            roomNumber: invoice.room.room_number,
                        })}
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
                                <Label htmlFor="amount">
                                    {t('payments.submitDialog.amount')}
                                </Label>
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
                                <Label htmlFor="method">
                                    {t('payments.submitDialog.method')}
                                </Label>
                                <Select name="method" defaultValue="cash">
                                    <SelectTrigger
                                        id="method"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">
                                            {t('payments.method.cash')}
                                        </SelectItem>
                                        <SelectItem value="bank_transfer">
                                            {t('payments.method.bank_transfer')}
                                        </SelectItem>
                                        <SelectItem value="qr">
                                            {t('payments.method.qr')}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.method} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="proof_image">
                                    {t('payments.submitDialog.proofOptional')}
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
                                    {processing && <Spinner className="mr-2" />}
                                    {t('payments.submitDialog.submit')}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
