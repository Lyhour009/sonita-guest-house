import { Form } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import StaffAccountController from '@/actions/App/Http/Controllers/Admin/StaffAccountController';
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
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import StaffForm from './staff-form';

export default function StaffCreateDialog() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 size-4" />
                    {t('staffAccounts.addAccount')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('staffAccounts.addAccount')}</DialogTitle>
                </DialogHeader>

                <Form
                    {...StaffAccountController.store.form()}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors, isDirty }) => (
                        <>
                            <StaffForm errors={errors} />

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
                                    {t('staffAccounts.createAccount')}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
