import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import type { Paginated } from '@/types';

type Props<T> = {
    meta: Omit<Paginated<T>, 'data'>;
};

export default function Pagination<T>({ meta }: Props<T>) {
    const { t } = useTranslation();

    const labelFor = (label: string) => {
        if (label.includes('Previous')) {
            return t('common.pagination.previous');
        }

        if (label.includes('Next')) {
            return t('common.pagination.next');
        }

        return label;
    };

    if (meta.last_page <= 1) {
        return null;
    }

    return (
        <nav
            aria-label={t('common.pagination.ariaLabel')}
            className="flex flex-wrap items-center justify-center gap-1"
        >
            {meta.links.map((link, index) => (
                <Button
                    key={`${link.label}-${index}`}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={!link.url}
                    asChild={!!link.url}
                >
                    {link.url ? (
                        <Link href={link.url} preserveScroll preserveState>
                            {labelFor(link.label)}
                        </Link>
                    ) : (
                        <span>{labelFor(link.label)}</span>
                    )}
                </Button>
            ))}
        </nav>
    );
}
