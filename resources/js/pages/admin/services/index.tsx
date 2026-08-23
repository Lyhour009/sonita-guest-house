import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    DollarSign,
    Package,
    Repeat,
    Search,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Pagination from '@/components/pagination';
import ServiceCreateDialog from '@/components/service-create-dialog';
import ServiceEditDialog from '@/components/service-edit-dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { destroy, index as adminServicesIndex } from '@/routes/admin/services';
import type { Paginated, Service } from '@/types';

type Filters = {
    search: string | null;
    usage: string | null;
};

type Stats = {
    total: number;
    totalBookings: number;
    totalRevenue: number;
    unusedCount: number;
};

type Props = {
    services: Paginated<Service>;
    filters: Filters;
    stats?: Stats;
};

export default function AdminServicesIndex({
    services,
    filters,
    stats,
}: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');
    const [usage, setUsage] = useState(filters.usage ?? 'any');
    const [editingServiceId, setEditingServiceId] = useState<string | null>(
        null,
    );
    const [isFiltering, setIsFiltering] = useState(false);

    const editingService = useMemo(
        () =>
            services.data.find((service) => service.id === editingServiceId) ??
            null,
        [services.data, editingServiceId],
    );

    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            if (event.detail.visit.only?.includes('services')) {
                setIsFiltering(true);
            }
        });
        const removeFinish = router.on('finish', (event) => {
            if (event.detail.visit.only?.includes('services')) {
                setIsFiltering(false);
            }
        });

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    const applyFilters = (next: Partial<Filters>) => {
        const nextSearch = next.search !== undefined ? next.search : search;
        const nextUsage = next.usage !== undefined ? next.usage : usage;

        router.get(
            adminServicesIndex().url,
            {
                search: nextSearch || undefined,
                usage: nextUsage === 'any' ? undefined : nextUsage,
            },
            {
                preserveState: true,
                replace: true,
                only: ['services', 'filters', 'stats'],
            },
        );
    };

    const debouncedSearch = useDebouncedValue(search, 300);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        applyFilters({ search: debouncedSearch });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const { isPending, withPending } = usePendingAction();

    const deleteService = (serviceId: string) => {
        router.delete(
            destroy(serviceId).url,
            withPending(`delete-${serviceId}`, {
                preserveScroll: true,
                only: ['services', 'stats'],
            }),
        );
    };

    return (
        <>
            <Head title={t('services.title')} />

            <div className="w-full space-y-5 bg-background p-4 md:p-6">
                <div className="space-y-4">
                    <div className="pt-1">
                        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            {t('services.title')}
                        </h1>
                        <p className="mt-0.5 font-sans text-sm text-muted-foreground">
                            {t('services.subtitle')}
                        </p>
                    </div>

                    {/* Pulse KPI Metric Cards */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Package className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {stats?.total || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('services.stats.total')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-info/10 text-blue-600 dark:text-blue-400">
                                <Repeat className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {stats?.totalBookings || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('services.stats.totalBookings')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-emerald-600 dark:text-emerald-400">
                                <DollarSign className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    ${(stats?.totalRevenue || 0).toFixed(2)}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('services.stats.totalRevenue')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-warning/10 text-amber-600 dark:text-amber-400">
                                <AlertTriangle className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {stats?.unusedCount || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('services.stats.unused')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col items-stretch justify-between gap-3 rounded-3xl border border-border/50 bg-card/60 p-3 shadow-sm backdrop-blur-md sm:flex-row sm:items-center">
                    <div className="flex max-w-xl flex-1 flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={t('services.searchPlaceholder')}
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
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
                            value={usage}
                            onValueChange={(value) => {
                                setUsage(value);
                                applyFilters({ usage: value });
                            }}
                        >
                            <SelectTrigger className="h-10 w-full rounded-2xl border-border bg-background font-sans text-sm shadow-2xs sm:w-48">
                                <SelectValue
                                    placeholder={t(
                                        'services.usageFilter.placeholder',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border font-sans">
                                <SelectItem value="any">
                                    {t('services.usageFilter.any')}
                                </SelectItem>
                                <SelectItem value="used">
                                    {t('services.usageFilter.used')}
                                </SelectItem>
                                <SelectItem value="unused">
                                    {t('services.usageFilter.unused')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <ServiceCreateDialog />
                </div>

                {/* Table */}
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
                                        {t('services.table.name')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('services.table.price')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('services.table.bookings')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('services.table.revenue')}
                                    </TableHead>
                                    <TableHead className="h-13 py-4 pr-6 text-right font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.actions.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border/60">
                                {services.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-24 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="flex size-16 items-center justify-center rounded-3xl bg-muted shadow-inner">
                                                    <Package className="size-8 text-muted-foreground opacity-50" />
                                                </div>
                                                <p className="font-sans text-sm font-bold text-foreground">
                                                    {t('services.empty')}
                                                </p>
                                                <p className="max-w-sm font-sans text-sm text-muted-foreground">
                                                    {t(
                                                        'services.emptyDescription',
                                                    )}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    services.data.map((service) => (
                                        <TableRow
                                            key={service.id}
                                            className="h-16 transition-all duration-300 hover:bg-primary/5"
                                        >
                                            <TableCell className="py-3.5 pl-6">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-sans text-sm font-bold text-foreground">
                                                        {service.name}
                                                    </p>
                                                    {service.usage_count ===
                                                        0 && (
                                                        <Badge
                                                            variant="outline"
                                                            className="border-warning/40 bg-warning/10 font-sans text-[10px] font-semibold text-amber-700 dark:text-amber-300"
                                                        >
                                                            {t(
                                                                'services.unused',
                                                            )}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-sm font-semibold text-foreground">
                                                ${service.price}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-sm text-foreground">
                                                {service.usage_count}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-sm text-foreground">
                                                ${service.revenue.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="py-3.5 pr-6 text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 rounded-full font-sans text-xs font-semibold"
                                                        onClick={() =>
                                                            setEditingServiceId(
                                                                service.id,
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            'common.actions.edit',
                                                        )}
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                className="h-8 rounded-full font-sans text-xs font-semibold"
                                                                disabled={
                                                                    service.usage_count >
                                                                    0
                                                                }
                                                                title={
                                                                    service.usage_count >
                                                                    0
                                                                        ? t(
                                                                              'services.cannotDeleteInUse',
                                                                          )
                                                                        : undefined
                                                                }
                                                            >
                                                                {t(
                                                                    'common.actions.delete',
                                                                )}
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    {t(
                                                                        'services.deleteService.title',
                                                                        {
                                                                            name: service.name,
                                                                        },
                                                                    )}
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    {t(
                                                                        'services.deleteService.description',
                                                                    )}
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    {t(
                                                                        'common.actions.cancel',
                                                                    )}
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    variant="destructive"
                                                                    disabled={isPending(
                                                                        `delete-${service.id}`,
                                                                    )}
                                                                    onClick={() =>
                                                                        deleteService(
                                                                            service.id,
                                                                        )
                                                                    }
                                                                >
                                                                    {isPending(
                                                                        `delete-${service.id}`,
                                                                    ) && (
                                                                        <Spinner className="mr-2" />
                                                                    )}
                                                                    {t(
                                                                        'common.actions.delete',
                                                                    )}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <p className="font-sans text-xs text-muted-foreground">
                        {t('services.showingCount', {
                            shown: services.data.length,
                            total: services.total,
                        })}
                    </p>
                    <Pagination meta={services} />
                </div>
            </div>

            <ServiceEditDialog
                service={editingService}
                onOpenChange={(open) => !open && setEditingServiceId(null)}
            />
        </>
    );
}

AdminServicesIndex.layout = {
    breadcrumbs: [{ title: 'Services', href: adminServicesIndex() }],
};
