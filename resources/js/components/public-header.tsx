import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import LanguageToggle from '@/components/language-toggle';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { dashboard, login, register } from '@/routes';

type Props = {
    left: ReactNode;
    className?: string;
};

export default function PublicHeader({ left, className }: Props) {
    const { auth } = usePage().props;
    const { t } = useTranslation();

    return (
        <header
            className={cn(
                'mx-auto mb-8 flex w-full items-center justify-between',
                className,
            )}
        >
            {left}
            <nav className="flex items-center gap-3 text-sm">
                <LanguageToggle />
                {auth.user ? (
                    <Button asChild size="sm">
                        <Link href={dashboard()}>{t('nav.dashboard')}</Link>
                    </Button>
                ) : (
                    <>
                        <Button asChild variant="ghost" size="sm">
                            <Link href={login()}>{t('nav.login')}</Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link href={register()}>{t('nav.register')}</Link>
                        </Button>
                    </>
                )}
            </nav>
        </header>
    );
}
