import { Form, Head } from '@inertiajs/react';
import { Lock, Mail, User as UserIcon } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('auth.register.headTitle')} />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-3.5">
                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <Label htmlFor="full_name" className="text-xs font-semibold text-foreground/85">
                                    {t('auth.register.nameLabel')}
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                        <UserIcon className="size-4" />
                                    </div>
                                    <Input
                                        id="full_name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="full_name"
                                        placeholder={t('auth.register.namePlaceholder')}
                                        className="h-10.5 rounded-xl pl-9.5 text-sm transition-all focus-visible:ring-primary/20"
                                    />
                                </div>
                                <InputError message={errors.full_name} />
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-semibold text-foreground/85">
                                    {t('auth.register.emailLabel')}
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                        <Mail className="size-4" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder={t('auth.register.emailPlaceholder')}
                                        className="h-10.5 rounded-xl pl-9.5 text-sm transition-all focus-visible:ring-primary/20"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-xs font-semibold text-foreground/85">
                                    {t('auth.register.passwordLabel')}
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-muted-foreground">
                                        <Lock className="size-4" />
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder={t('auth.register.passwordPlaceholder')}
                                        passwordrules={passwordRules}
                                        className="h-10.5 rounded-xl pl-9.5 text-sm transition-all focus-visible:ring-primary/20"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <Label htmlFor="password_confirmation" className="text-xs font-semibold text-foreground/85">
                                    {t('auth.register.confirmPasswordLabel')}
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-muted-foreground">
                                        <Lock className="size-4" />
                                    </div>
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder={t('auth.register.confirmPasswordPlaceholder')}
                                        passwordrules={passwordRules}
                                        className="h-10.5 rounded-xl pl-9.5 text-sm transition-all focus-visible:ring-primary/20"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="h-11 w-full rounded-xl text-sm font-semibold shadow-md shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.99] cursor-pointer mt-2"
                                tabIndex={5}
                                disabled={processing}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner className="mr-2" />}
                                {t('auth.register.submitButton')}
                            </Button>
                        </div>

                        {/* Login Link */}
                        <div className="border-t border-border/50 pt-4 text-center text-xs text-muted-foreground">
                            {t('auth.register.hasAccountPrefix')}{' '}
                            <TextLink href={login()} tabIndex={6} className="font-semibold text-primary hover:underline">
                                {t('auth.register.loginLink')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};
