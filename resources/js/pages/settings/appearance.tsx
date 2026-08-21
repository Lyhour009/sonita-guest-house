import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { useTranslation } from '@/hooks/use-translation';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('auth.settings.appearance.headTitle')} />

            <h1 className="sr-only">
                {t('auth.settings.appearance.headTitle')}
            </h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={t('auth.settings.appearance.title')}
                    description={t('auth.settings.appearance.description')}
                />
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Appearance settings',
            href: editAppearance(),
        },
    ],
};
