import { Form, Head } from '@inertiajs/react';
import { Lock, Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import { register } from '@/routes';
import { store } from '@/routes/login';

type Props = {
    status?: string;
};

export default function Login({ status }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('auth.login.headTitle')} />

            {status && (
                <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 p-3.5 text-center text-sm font-medium text-green-600 dark:text-green-400 animate-in fade-in-0 duration-200">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-4.5">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-foreground/90 font-sans">
                                    {t('auth.login.emailLabel')}
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                                        <Mail className="size-5" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder={t('auth.login.emailPlaceholder')}
                                        className="h-12 rounded-xl pl-11 text-[15px] font-sans transition-all focus-visible:ring-primary/20"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-semibold text-foreground/90 font-sans">
                                        {t('auth.login.passwordLabel')}
                                    </Label>
                                </div>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3.5 text-muted-foreground">
                                        <Lock className="size-5" />
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder={t('auth.login.passwordPlaceholder')}
                                        className="h-12 rounded-xl pl-11 text-[15px] font-sans transition-all focus-visible:ring-primary/20"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-2.5 pt-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="size-4.5 rounded-md border-border/80 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                />
                                <Label htmlFor="remember" className="cursor-pointer text-sm font-normal text-muted-foreground select-none font-sans">
                                    {t('auth.login.rememberMe')}
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="h-12 w-full rounded-xl text-base font-semibold shadow-md shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.99] cursor-pointer mt-1 font-sans"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner className="mr-2" />}
                                {t('auth.login.submitButton')}
                            </Button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="border-t border-border/60 pt-5 text-center text-sm text-muted-foreground font-sans">
                            {t('auth.login.noAccountPrefix')}{' '}
                            <TextLink href={register()} tabIndex={6} className="font-semibold text-primary hover:underline">
                                {t('auth.login.signUpLink')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
