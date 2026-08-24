import { Head, router } from '@inertiajs/react';
import { Clock, Search, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { index as adminActivityLogIndex } from '@/routes/admin/activity-log';
import type { ActivityLogEntry, Paginated } from '@/types';

type Filters = {
    search: string | null;
    action: string | null;
};

type Props = {
    logs: Paginated<ActivityLogEntry>;
    filters: Filters;
    actionOptions: string[];
};

export default function AdminActivityLogIndex({
    logs,
    filters,
    actionOptions,
}: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');
    const [action, setAction] = useState(filters.action ?? 'any');
    const [isFiltering, setIsFiltering] = useState(false);
    const isFirstRender = useRef(true);

    const applyFilters = (next: Partial<Filters>) => {
        const nextSearch = next.search !== undefined ? next.search : search;
        const nextAction = next.action !== undefined ? next.action : action;

        router.get(
            adminActivityLogIndex().url,
            {
                search: nextSearch || undefined,
                action: nextAction === 'any' ? undefined : nextAction,
            },
            { preserveState: true, replace: true, only: ['logs', 'filters'] },
        );
    };

    const debouncedSearch = useDebouncedValue(search, 300);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        applyFilters({ search: debouncedSearch });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            if (event.detail.visit.only?.includes('logs')) {
                setIsFiltering(true);
            }
        });
        const removeFinish = router.on('finish', (event) => {
            if (event.detail.visit.only?.includes('logs')) {
                setIsFiltering(false);
            }
        });

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    return (
        <>
            <Head title={t('adminActivityLog.title')} />

            <div className="space-y-8 p-6 lg:p-10">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-sans text-3xl font-bold tracking-tight">
                            {t('adminActivityLog.title')}
                        </h1>
                        <p className="mt-1 font-sans text-sm text-muted-foreground">
                            {t('adminActivityLog.subtitle')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-stretch gap-3 rounded-3xl border border-border/50 bg-card/60 p-3 shadow-sm backdrop-blur-md sm:flex-row sm:items-center">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={t(
                                'adminActivityLog.searchPlaceholder',
                            )}
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

                    <Select
                        value={action}
                        onValueChange={(value) => {
                            setAction(value);
                            applyFilters({ action: value });
                        }}
                    >
                        <SelectTrigger className="h-10 w-full rounded-2xl border-border bg-background font-sans text-sm shadow-2xs sm:w-56">
                            <SelectValue
                                placeholder={t(
                                    'adminActivityLog.actionFilter.placeholder',
                                )}
                            />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border font-sans">
                            <SelectItem value="any">
                                {t('adminActivityLog.actionFilter.any')}
                            </SelectItem>
                            {actionOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                                        {t('adminActivityLog.table.causer')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('adminActivityLog.table.action')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t(
                                            'adminActivityLog.table.description',
                                        )}
                                    </TableHead>
                                    <TableHead className="h-13 py-4 pr-6 text-right font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('adminActivityLog.table.when')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="py-16 text-center"
                                        >
                                            <p className="font-sans text-sm font-semibold text-foreground">
                                                {t('adminActivityLog.empty')}
                                            </p>
                                            <p className="mt-1 font-sans text-xs text-muted-foreground">
                                                {t(
                                                    'adminActivityLog.emptyDescription',
                                                )}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.data.map((log) => (
                                        <TableRow
                                            key={log.id}
                                            className="h-16 border-border/60"
                                        >
                                            <TableCell className="py-3.5 pl-6">
                                                <span className="flex items-center gap-1.5 font-sans text-sm font-semibold text-foreground">
                                                    <User className="size-3.5 text-muted-foreground" />
                                                    {log.causer_name}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <Badge
                                                    variant="outline"
                                                    className="border-primary/40 bg-primary/10 font-mono text-[11px] text-primary"
                                                >
                                                    {log.action}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-sm text-muted-foreground">
                                                {log.description}
                                            </TableCell>
                                            <TableCell className="py-3.5 pr-6 text-right">
                                                <span className="flex items-center justify-end gap-1.5 font-sans text-xs text-muted-foreground">
                                                    <Clock className="size-3.5" />
                                                    {log.created_at}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6">
                        <Pagination meta={logs} />
                    </div>
                </div>
            </div>
        </>
    );
}

AdminActivityLogIndex.layout = {
    breadcrumbs: [{ title: 'Activity Log', href: adminActivityLogIndex() }],
};
