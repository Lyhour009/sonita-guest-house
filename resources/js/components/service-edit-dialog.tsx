import { Form } from '@inertiajs/react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import type { Service } from '@/types';

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
                                <div className="grid gap-1.5">
                                    <Label htmlFor="name">
                                        {t('services.form.name')}
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={service.name}
                                        required
                                    />
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
                                        defaultValue={service.price}
                                        required
                                    />
                                    <InputError message={errors.price} />
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={processing || !isDirty}
                                    >
                                        {processing && (
                                            <Spinner className="mr-2" />
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
