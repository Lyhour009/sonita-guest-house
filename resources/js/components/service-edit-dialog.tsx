import { Form } from '@inertiajs/react';
import { Save } from 'lucide-react';
import ServiceController from '@/actions/App/Http/Controllers/Admin/ServiceController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import type { Service } from '@/types';
import ServiceForm from './service-form';

type Props = {
    service: Service | null;
    onOpenChange: (open: boolean) => void;
};

export default function ServiceEditDialog({ service, onOpenChange }: Props) {
    const { t } = useTranslation();

    return (
        <Dialog open={service !== null} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('services.editService', {
                            name: service?.name ?? '',
                        })}
                    </DialogTitle>
                </DialogHeader>

                {service && (
                    <Form
                        {...ServiceController.update.form(service.id)}
                        onSuccess={() => onOpenChange(false)}
                        className="space-y-4"
                    >
                        {({ processing, errors, isDirty }) => (
                            <>
                                <ServiceForm
                                    service={service}
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
