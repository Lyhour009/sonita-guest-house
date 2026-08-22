
import InputError from '@/components/input-error';
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

type StaffFormProps = {
    staff?: StaffAccount;
    errors: Partial<Record<string, string>>;
    isEdit?: boolean;
};

export default function StaffForm({ staff, errors, isEdit = false }: StaffFormProps) {
    const { t } = useTranslation();

    return (
        <>
            <div className="grid gap-1.5">
                <Label htmlFor="full_name">
                    {t('staffAccounts.form.fullName')}
                </Label>
                <Input
                    id="full_name"
                    name="full_name"
                    defaultValue={staff?.full_name}
                    required
                />
                <InputError message={errors.full_name} />
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="email">{t('staffAccounts.form.email')}</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={staff?.email}
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
                    defaultValue={staff?.phone_number ?? ''}
                />
                <InputError message={errors.phone_number} />
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="role">{t('staffAccounts.form.role')}</Label>
                <Select name="role" defaultValue={staff?.role ?? 'receptionist'}>
                    <SelectTrigger id="role" className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent portaled={false}>
                        <SelectItem value="receptionist">
                            {t('staffAccounts.roles.receptionist')}
                        </SelectItem>
                        <SelectItem value="housekeeping">
                            {t('staffAccounts.roles.housekeeping')}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.role} />
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="password">
                    {isEdit ? t('staffAccounts.form.newPassword') : t('staffAccounts.form.password')}
                </Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required={!isEdit}
                    placeholder={isEdit ? t('staffAccounts.form.newPasswordPlaceholder') : ''}
                />
                <InputError message={errors.password} />
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="password_confirmation">
                    {isEdit ? t('staffAccounts.form.confirmNewPassword') : t('staffAccounts.form.confirmPassword')}
                </Label>
                <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    required={!isEdit}
                />
            </div>
        </>
    );
}
