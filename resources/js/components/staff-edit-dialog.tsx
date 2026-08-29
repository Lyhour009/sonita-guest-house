import { Form } from '@inertiajs/react';
import { Save } from 'lucide-react';
import StaffAccountController from '@/actions/App/Http/Controllers/Admin/StaffAccountController';
import InputError from '@/components/input-error';
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
import type { StaffAccount } from '@/types';
import StaffForm from './staff-form';

type Props = {
    staff: StaffAccount | null;
    onOpenChange: (open: boolean) => void;
};

export default function StaffEditDialog({ staff, onOpenChange }: Props) {
    const { t } = useTranslation();

    return (
        <Dialog open={staff !== null} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('staffAccounts.editAccount', {
                            name: staff?.full_name ?? '',
                        })}
                    </DialogTitle>
                </DialogHeader>

                {staff && (
                    <Form
                        {...StaffAccountController.update.form(staff.id)}
                        onSuccess={() => onOpenChange(false)}
                        className="space-y-4"
                    >
                        {({ processing, errors, isDirty }) => (
                            <>
                                <StaffForm
                                    staff={staff}
                                    errors={errors}
                                    isEdit
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
