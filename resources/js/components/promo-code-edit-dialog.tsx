import { Form } from '@inertiajs/react';
import { Save } from 'lucide-react';
import PromoCodeController from '@/actions/App/Http/Controllers/Admin/PromoCodeController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import type { PromoCode } from '@/types';
import PromoCodeForm from './promo-code-form';

type Props = {
    promoCode: PromoCode | null;
    onOpenChange: (open: boolean) => void;
};

export default function PromoCodeEditDialog({
    promoCode,
    onOpenChange,
}: Props) {
    const { t } = useTranslation();

    return (
        <Dialog open={promoCode !== null} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('adminPromoCodes.editPromoCode', {
                            code: promoCode?.code ?? '',
                        })}
                    </DialogTitle>
                </DialogHeader>

                {promoCode && (
                    <Form
                        {...PromoCodeController.update.form(promoCode.id)}
                        onSuccess={() => onOpenChange(false)}
                        className="space-y-4"
                    >
                        {({ processing, errors, isDirty }) => (
                            <>
                                <PromoCodeForm
                                    promoCode={promoCode}
                                    errors={errors}
                                />

                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={processing || !isDirty}
                                    >
                                        {processing ? (
                                            <Spinner className="mr-2" />
                                        ) : (
                                            <Save className="mr-2 size-4" />
                                        )}
                                        {t('common.actions.saveChanges')}
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
