import { Form, Head } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('auth.confirmPassword.headTitle')} />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="password"
                                className="text-xs font-semibold text-foreground/85"
                            >
                                {t('auth.confirmPassword.passwordLabel')}
                            </Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-muted-foreground">
                                    <Lock className="size-4" />
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    placeholder={t(
                                        'auth.confirmPassword.passwordPlaceholder',
                                    )}
                                    autoComplete="current-password"
                                    autoFocus
                                    className="h-10.5 rounded-xl pl-9.5 text-sm transition-all focus-visible:ring-primary/20"
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <Button
                            type="submit"
                            className="h-11 w-full cursor-pointer rounded-xl text-sm font-semibold shadow-md shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.99]"
                            disabled={processing}
                            data-test="confirm-password-button"
                        >
                            {processing && <Spinner className="mr-2" />}
                            {t('auth.confirmPassword.submitButton')}
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Confirm password',
    description:
        'This is a secure area of the application. Please confirm your password before continuing.',
};
