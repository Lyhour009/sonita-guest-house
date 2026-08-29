import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('auth.settings.profile.headTitle')} />

            <h1 className="sr-only">{t('auth.settings.profile.headTitle')}</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={t('auth.settings.profile.title')}
                    description={t('auth.settings.profile.description')}
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors, isDirty }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="full_name">
                                    {t('auth.settings.profile.nameLabel')}
                                </Label>

                                <Input
                                    id="full_name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.full_name}
                                    name="full_name"
                                    required
                                    autoComplete="name"
                                    placeholder={t(
                                        'auth.settings.profile.namePlaceholder',
                                    )}
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.full_name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    {t('auth.settings.profile.emailLabel')}
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder={t(
                                        'auth.settings.profile.emailPlaceholder',
                                    )}
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing || !isDirty}
                                    data-test="update-profile-button"
                                >
                                    {processing && <Spinner className="mr-2" />}
                                    {t('common.actions.save')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
