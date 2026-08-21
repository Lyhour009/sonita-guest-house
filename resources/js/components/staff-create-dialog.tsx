import { Form } from '@inertiajs/react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';

export default function StaffCreateDialog() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{t('staffAccounts.addAccount')}</Button>
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
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-1.5">
                                <Label htmlFor="full_name">
                                    {t('staffAccounts.form.fullName')}
                                </Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
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
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="phone_number">
                                    {t('staffAccounts.form.phoneNumber')}
                                </Label>
                                <Input id="phone_number" name="phone_number" />
                                <InputError message={errors.phone_number} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="role">
                                    {t('staffAccounts.form.role')}
                                </Label>
                                <Select name="role" defaultValue="receptionist">
                                    <SelectTrigger id="role" className="w-full">
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
                                    {t('staffAccounts.form.password')}
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="password_confirmation">
                                    {t('staffAccounts.form.confirmPassword')}
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    required
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner className="mr-2" />}
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
