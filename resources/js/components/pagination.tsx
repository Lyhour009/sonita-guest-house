import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types';

type Props<T> = {
    meta: Omit<Paginated<T>, 'data'>;
};

function labelFor(label: string) {
    if (label.includes('Previous')) {
        return '‹ Previous';
    }

    if (label.includes('Next')) {
        return 'Next ›';
    }

    return label;
}

export default function Pagination<T>({ meta }: Props<T>) {
    if (meta.last_page <= 1) {
        return null;
    }

    return (
        <nav
            aria-label="Pagination"
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
                        <Link href={link.url} preserveScroll>
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
