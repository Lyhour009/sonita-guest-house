import { Form } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import PromoCodeController from '@/actions/App/Http/Controllers/Admin/PromoCodeController';
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
import PromoCodeForm from './promo-code-form';

export default function PromoCodeCreateDialog() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 size-4" />
                    {t('adminPromoCodes.addPromoCode')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('adminPromoCodes.addPromoCode')}
                    </DialogTitle>
                </DialogHeader>

                <Form
                    {...PromoCodeController.store.form()}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors, isDirty }) => (
                        <>
                            <PromoCodeForm errors={errors} />

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
                                    {t('adminPromoCodes.createPromoCode')}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
