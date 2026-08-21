import { Form } from '@inertiajs/react';
import { useState } from 'react';
import ServiceController from '@/actions/App/Http/Controllers/Admin/ServiceController';
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
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';

export default function ServiceCreateDialog() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{t('services.addService')}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('services.addService')}</DialogTitle>
                </DialogHeader>

                <Form
                    {...ServiceController.store.form()}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-1.5">
                                <Label htmlFor="name">
                                    {t('services.form.name')}
                                </Label>
                                <Input id="name" name="name" required />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="price">
                                    {t('services.form.price')}
                                </Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                                <InputError message={errors.price} />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner className="mr-2" />}
                                    {t('services.createService')}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
