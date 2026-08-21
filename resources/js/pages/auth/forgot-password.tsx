import { Form, Head } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('auth.forgotPassword.headTitle')} />

            {status && (
                <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 p-3.5 text-center text-sm font-medium text-green-600 dark:text-green-400 animate-in fade-in-0 duration-200">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <div className="space-y-4.5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-foreground/90 font-sans">
                                    {t('auth.forgotPassword.emailLabel')}
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                                        <Mail className="size-5" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="off"
                                        autoFocus
                                        placeholder={t('auth.forgotPassword.emailPlaceholder')}
                                        className="h-12 rounded-xl pl-11 text-[15px] font-sans transition-all focus-visible:ring-primary/20"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <Button
                                type="submit"
                                className="h-12 w-full rounded-xl text-base font-semibold shadow-md shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.99] cursor-pointer mt-1 font-sans"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing && <Spinner className="mr-2" />}
                                {t('auth.forgotPassword.submitButton')}
                            </Button>
                        </div>
                    )}
                </Form>

                <div className="border-t border-border/60 pt-5 text-center text-sm text-muted-foreground font-sans">
                    <span>{t('auth.forgotPassword.returnPrefix')}</span>{' '}
                    <TextLink href={login()} className="font-semibold text-primary hover:underline">
                        {t('auth.forgotPassword.returnLink')}
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link',
};
