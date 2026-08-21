import { Form } from '@inertiajs/react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import type { StaffAccount } from '@/types';

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
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="full_name">
                                        {t('staffAccounts.form.fullName')}
                                    </Label>
                                    <Input
                                        id="full_name"
                                        name="full_name"
                                        defaultValue={staff.full_name}
                                        required
                                    />
                                    <InputError message={errors.full_name} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="email">
                                        {t('staffAccounts.form.email')}
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={staff.email}
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="phone_number">
                                        {t('staffAccounts.form.phoneNumber')}
                                    </Label>
                                    <Input
                                        id="phone_number"
                                        name="phone_number"
                                        defaultValue={staff.phone_number ?? ''}
                                    />
                                    <InputError message={errors.phone_number} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="role">
                                        {t('staffAccounts.form.role')}
                                    </Label>
                                    <Select
                                        name="role"
                                        defaultValue={staff.role}
                                    >
                                        <SelectTrigger
                                            id="role"
                                            className="w-full"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="receptionist">
                                                {t(
                                                    'staffAccounts.roles.receptionist',
                                                )}
                                            </SelectItem>
                                            <SelectItem value="housekeeping">
                                                {t(
                                                    'staffAccounts.roles.housekeeping',
                                                )}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.role} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="password">
                                        {t('staffAccounts.form.newPassword')}
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder={t(
                                            'staffAccounts.form.newPasswordPlaceholder',
                                        )}
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="password_confirmation">
                                        {t(
                                            'staffAccounts.form.confirmNewPassword',
                                        )}
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                    />
                                </div>

                                <DialogFooter>
                                    <Button type="submit" disabled={processing}>
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
