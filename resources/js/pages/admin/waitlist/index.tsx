import { Head, router } from '@inertiajs/react';
import {
    BellRing,
    Calendar,
    Check,
    Mail,
    Phone,
    Search,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { notify } from '@/actions/App/Http/Controllers/Admin/WaitlistController';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { usePendingAction } from '@/hooks/use-pending-action';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { index as adminWaitlistIndex } from '@/routes/admin/waitlist';
import type { Paginated, WaitlistEntry } from '@/types';

type Filters = {
    search: string | null;
};

type Props = {
    entries: Paginated<WaitlistEntry>;
    filters: Filters;
};

export default function AdminWaitlistIndex({ entries, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');
    const [isFiltering, setIsFiltering] = useState(false);
    const isFirstRender = useRef(true);
    const { isPending, withPending } = usePendingAction();

    const debouncedSearch = useDebouncedValue(search, 300);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        router.get(
            adminWaitlistIndex().url,
            { search: debouncedSearch || undefined },
            {
                preserveState: true,
                replace: true,
                only: ['entries', 'filters'],
            },
        );
    }, [debouncedSearch]);

    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            if (event.detail.visit.only?.includes('entries')) {
                setIsFiltering(true);
            }
        });
        const removeFinish = router.on('finish', (event) => {
            if (event.detail.visit.only?.includes('entries')) {
                setIsFiltering(false);
            }
        });

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    const notifyEntry = (entryId: string) => {
        router.patch(
            notify.url(entryId),
            {},
            withPending(`notify-${entryId}`, { preserveScroll: true }),
        );
    };

    return (
        <>
            <Head title={t('adminWaitlist.title')} />

            <div className="space-y-8 p-6 lg:p-10">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-sans text-3xl font-bold tracking-tight">
                            {t('adminWaitlist.title')}
                        </h1>
                        <p className="mt-1 font-sans text-sm text-muted-foreground">
                            {t('adminWaitlist.subtitle')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-stretch gap-3 rounded-3xl border border-border/50 bg-card/60 p-3 shadow-sm backdrop-blur-md sm:flex-row sm:items-center">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={t('adminWaitlist.searchPlaceholder')}
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="h-10 rounded-2xl border-border bg-background pr-8 pl-9.5 font-sans text-sm shadow-2xs"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                <div
                    className={cn(
                        'transition-opacity duration-200',
                        isFiltering && 'pointer-events-none opacity-50',
                    )}
                >
                    <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-md">
                        <Table>
                            <TableHeader className="border-b border-border bg-muted/50">
                                <TableRow className="h-13 border-border hover:bg-transparent">
                                    <TableHead className="h-13 py-4 pl-6 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('adminWaitlist.table.contact')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('adminWaitlist.table.stayType')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('adminWaitlist.table.dates')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('adminWaitlist.table.status')}
                                    </TableHead>
                                    <TableHead className="h-13 py-4 pr-6 text-right font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.actions.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-16 text-center"
                                        >
                                            <p className="font-sans text-sm font-semibold text-foreground">
                                                {t('adminWaitlist.empty')}
                                            </p>
                                            <p className="mt-1 font-sans text-xs text-muted-foreground">
                                                {t(
                                                    'adminWaitlist.emptyDescription',
                                                )}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    entries.data.map((entry) => (
                                        <TableRow
                                            key={entry.id}
                                            className="h-16 border-border/60"
                                        >
                                            <TableCell className="py-3.5 pl-6">
                                                <p className="flex items-center gap-1.5 font-sans text-sm font-bold text-foreground">
                                                    <Mail className="size-3.5 text-muted-foreground" />
                                                    {entry.email}
                                                </p>
                                                {entry.phone_number && (
                                                    <p className="mt-0.5 flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
                                                        <Phone className="size-3" />
                                                        {entry.phone_number}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-sm text-foreground">
                                                {t(
                                                    `common.reservationType.${entry.stay_type}`,
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="size-3.5" />
                                                    {entry.from_date ?? '—'}
                                                    {' → '}
                                                    {entry.to_date ??
                                                        t(
                                                            'adminWaitlist.openEnded',
                                                        )}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                {entry.notified_at ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="gap-1 border-emerald-500/40 bg-emerald-500/10 font-sans text-xs text-emerald-700 dark:text-emerald-300"
                                                    >
                                                        <Check className="size-3" />
                                                        {t(
                                                            'adminWaitlist.status.notified',
                                                        )}
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="gap-1 border-amber-500/40 bg-amber-500/10 font-sans text-xs text-amber-700 dark:text-amber-300"
                                                    >
                                                        {t(
                                                            'adminWaitlist.status.pending',
                                                        )}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-3.5 pr-6 text-right">
                                                {!entry.notified_at && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            notifyEntry(
                                                                entry.id,
                                                            )
                                                        }
                                                        disabled={isPending(
                                                            `notify-${entry.id}`,
                                                        )}
                                                        className="rounded-xl font-sans text-xs font-semibold"
                                                    >
                                                        {isPending(
                                                            `notify-${entry.id}`,
                                                        ) ? (
                                                            <Spinner className="size-3.5" />
                                                        ) : (
                                                            <BellRing className="size-3.5" />
                                                        )}
                                                        {t(
                                                            'adminWaitlist.notify',
                                                        )}
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6">
                        <Pagination meta={entries} />
                    </div>
                </div>
            </div>
        </>
    );
}

AdminWaitlistIndex.layout = {
    breadcrumbs: [{ title: 'Waitlist', href: adminWaitlistIndex() }],
};
