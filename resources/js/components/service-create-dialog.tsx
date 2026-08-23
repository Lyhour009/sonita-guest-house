import { Form } from '@inertiajs/react';
import { Plus } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import ServiceForm from './service-form';

export default function ServiceCreateDialog() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 size-4" />
                    {t('services.addService')}
                </Button>
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
                    {({ processing, errors, isDirty }) => (
                        <>
                            <ServiceForm errors={errors} />

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
