import { Head, router } from '@inertiajs/react';
import { AlertTriangle, Clock, Search, UserX, Wrench, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MaintenanceController from '@/actions/App/Http/Controllers/Staff/MaintenanceRequestController';
import {
    MaintenancePriorityBadge,
    MaintenanceStatusBadge,
} from '@/components/maintenance-badges';
import MaintenanceRequestDialog from '@/components/maintenance-request-dialog';
import Pagination from '@/components/pagination';
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
import { index as staffMaintenanceIndex } from '@/routes/staff/maintenance';
import type {
    HousekeepingStaffOption,
    MaintenanceRoomSummary,
    MaintenanceStats,
    Paginated,
    StaffMaintenanceRequest,
} from '@/types';

type Filters = {
    search: string | null;
    status: string | null;
    priority: string | null;
};

type Props = {
    requests: Paginated<StaffMaintenanceRequest>;
    filters: Filters;
    isAdmin: boolean;
    housekeepingStaff: HousekeepingStaffOption[];
    rooms: MaintenanceRoomSummary[];
    stats?: MaintenanceStats;
};

const closedStatuses = ['resolved', 'cancelled'];

export default function StaffMaintenanceIndex({
    requests,
    filters,
    isAdmin,
    housekeepingStaff,
    rooms,
    stats,
}: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'any');
    const [priority, setPriority] = useState(filters.priority ?? 'any');
    const [isFiltering, setIsFiltering] = useState(false);

    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            if (event.detail.visit.only?.includes('requests')) {
                setIsFiltering(true);
            }
        });
        const removeFinish = router.on('finish', (event) => {
            if (event.detail.visit.only?.includes('requests')) {
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
        const nextStatus = next.status !== undefined ? next.status : status;
        const nextPriority =
            next.priority !== undefined ? next.priority : priority;

        router.get(
            staffMaintenanceIndex().url,
            {
                search: nextSearch || undefined,
                status: nextStatus === 'any' ? undefined : nextStatus,
                priority: nextPriority === 'any' ? undefined : nextPriority,
            },
            {
                preserveState: true,
                replace: true,
                only: ['requests', 'filters', 'stats'],
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

    const assign = (requestId: string, assignedTo: string) => {
        router.patch(
            MaintenanceController.assign.url(requestId),
            { assigned_to: assignedTo },
            withPending(requestId, {
                preserveScroll: true,
                only: ['requests', 'stats'],
            }),
        );
    };

    const updateStatus = (requestId: string, newStatus: string) => {
        router.patch(
            MaintenanceController.updateStatus.url(requestId),
            { status: newStatus },
            withPending(requestId, {
                preserveScroll: true,
                only: ['requests', 'stats'],
            }),
        );
    };

    return (
        <>
            <Head title={t('staff.maintenance.pageTitle')} />

            <div className="w-full space-y-5 bg-background p-4 md:p-6">
                <div className="space-y-4">
                    <div className="pt-1">
                        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            {t('staff.maintenance.pageTitle')}
                        </h1>
                        <p className="mt-0.5 font-sans text-sm text-muted-foreground">
                            {t('staff.maintenance.subtitle')}
                        </p>
                    </div>

                    {/* Pulse KPI Metric Cards */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Wrench className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {stats?.total || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('staff.maintenance.stats.total')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-warning/10 text-amber-600 dark:text-amber-400">
                                <Clock className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {stats?.open || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('staff.maintenance.stats.open')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-info/10 text-blue-600 dark:text-blue-400">
                                <UserX className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {stats?.unassigned || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('staff.maintenance.stats.unassigned')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-rose-600 dark:text-rose-400">
                                <AlertTriangle className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {stats?.overdue || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('staff.maintenance.stats.overdue')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col items-stretch justify-between gap-3 rounded-3xl border border-border/50 bg-card/60 p-3 shadow-sm backdrop-blur-md sm:flex-row sm:items-center">
                    <div className="flex max-w-2xl flex-1 flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={t(
                                    'staff.maintenance.searchPlaceholder',
                                )}
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
                            value={status}
                            onValueChange={(value) => {
                                setStatus(value);
                                applyFilters({ status: value });
                            }}
                        >
                            <SelectTrigger className="h-10 w-full rounded-2xl border-border bg-background font-sans text-sm shadow-2xs sm:w-44">
                                <SelectValue
                                    placeholder={t('common.labels.status')}
                                />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border font-sans">
                                <SelectItem value="any">
                                    {t('staff.maintenance.anyStatus')}
                                </SelectItem>
                                <SelectItem value="pending">
                                    {t('common.maintenanceStatus.pending')}
                                </SelectItem>
                                <SelectItem value="in_progress">
                                    {t('common.maintenanceStatus.in_progress')}
                                </SelectItem>
                                <SelectItem value="resolved">
                                    {t('common.maintenanceStatus.resolved')}
                                </SelectItem>
                                <SelectItem value="cancelled">
                                    {t('common.maintenanceStatus.cancelled')}
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={priority}
                            onValueChange={(value) => {
                                setPriority(value);
                                applyFilters({ priority: value });
                            }}
                        >
                            <SelectTrigger className="h-10 w-full rounded-2xl border-border bg-background font-sans text-sm shadow-2xs sm:w-44">
                                <SelectValue
                                    placeholder={t(
                                        'staff.maintenance.priorityPlaceholder',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border font-sans">
                                <SelectItem value="any">
                                    {t('staff.maintenance.anyPriority')}
                                </SelectItem>
                                <SelectItem value="low">
                                    {t('common.maintenancePriority.low')}
                                </SelectItem>
                                <SelectItem value="medium">
                                    {t('common.maintenancePriority.medium')}
                                </SelectItem>
                                <SelectItem value="high">
                                    {t('common.maintenancePriority.high')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <MaintenanceRequestDialog rooms={rooms} />
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
                                        {t('common.labels.room')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('staff.maintenance.table.title')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('staff.maintenance.table.reporter')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t(
                                            'staff.maintenance.priorityPlaceholder',
                                        )}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.status')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('staff.maintenance.table.assignee')}
                                    </TableHead>
                                    <TableHead className="h-13 py-4 pr-6 text-right font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.actions.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border/60">
                                {requests.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="py-24 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="flex size-16 items-center justify-center rounded-3xl bg-muted shadow-inner">
                                                    <Wrench className="size-8 text-muted-foreground opacity-50" />
                                                </div>
                                                <p className="font-sans text-sm font-bold text-foreground">
                                                    {t(
                                                        'staff.maintenance.empty',
                                                    )}
                                                </p>
                                                <p className="max-w-sm font-sans text-sm text-muted-foreground">
                                                    {t(
                                                        'staff.maintenance.emptyDescription',
                                                    )}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    requests.data.map((request) => (
                                        <TableRow
                                            key={request.id}
                                            className="h-16 transition-all duration-300 hover:bg-primary/5"
                                        >
                                            <TableCell className="px-4 py-3.5 pl-6 font-sans text-sm font-semibold text-foreground">
                                                {request.room.room_number}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="font-sans text-sm font-bold text-foreground">
                                                        {request.title}
                                                    </p>
                                                    {request.is_overdue && (
                                                        <Badge
                                                            variant="outline"
                                                            className="border-danger/40 bg-danger/10 font-sans text-[10px] font-semibold text-rose-600 dark:text-rose-400"
                                                        >
                                                            {t(
                                                                'staff.maintenance.stats.overdue',
                                                            )}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 font-sans text-xs text-muted-foreground">
                                                    {request.created_at}
                                                </p>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-sm text-muted-foreground">
                                                {request.reporter.full_name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <MaintenancePriorityBadge
                                                    priority={request.priority}
                                                />
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <MaintenanceStatusBadge
                                                    status={request.status}
                                                />
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                {isAdmin &&
                                                !closedStatuses.includes(
                                                    request.status,
                                                ) ? (
                                                    <Select
                                                        value={
                                                            request.assignee
                                                                ?.id ??
                                                            'unassigned'
                                                        }
                                                        disabled={isPending(
                                                            request.id,
                                                        )}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            assign(
                                                                request.id,
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-9 w-40 rounded-xl font-sans text-sm">
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'staff.maintenance.assignPlaceholder',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem
                                                                value="unassigned"
                                                                disabled
                                                            >
                                                                {t(
                                                                    'staff.maintenance.unassigned',
                                                                )}
                                                            </SelectItem>
                                                            {housekeepingStaff.map(
                                                                (staff) => (
                                                                    <SelectItem
                                                                        key={
                                                                            staff.id
                                                                        }
                                                                        value={
                                                                            staff.id
                                                                        }
                                                                    >
                                                                        {
                                                                            staff.full_name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <span className="font-sans text-sm text-muted-foreground">
                                                        {request.assignee
                                                            ?.full_name ?? '—'}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-3.5 pr-6 text-right">
                                                {!closedStatuses.includes(
                                                    request.status,
                                                ) && (
                                                    <div className="flex justify-end gap-1.5">
                                                        {request.status ===
                                                            'pending' && (
                                                            <Button
                                                                size="sm"
                                                                className="h-8 gap-1.5 rounded-full bg-primary font-sans text-xs font-semibold text-primary-foreground shadow-2xs transition-transform hover:scale-105"
                                                                disabled={isPending(
                                                                    request.id,
                                                                )}
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        request.id,
                                                                        'in_progress',
                                                                    )
                                                                }
                                                            >
                                                                {isPending(
                                                                    request.id,
                                                                ) && (
                                                                    <Spinner className="size-3.5" />
                                                                )}
                                                                {t(
                                                                    'staff.maintenance.start',
                                                                )}
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            className="h-8 gap-1.5 rounded-full bg-primary font-sans text-xs font-semibold text-primary-foreground shadow-2xs transition-transform hover:scale-105"
                                                            disabled={isPending(
                                                                request.id,
                                                            )}
                                                            onClick={() =>
                                                                updateStatus(
                                                                    request.id,
                                                                    'resolved',
                                                                )
                                                            }
                                                        >
                                                            {isPending(
                                                                request.id,
                                                            ) && (
                                                                <Spinner className="size-3.5" />
                                                            )}
                                                            {t(
                                                                'staff.maintenance.resolve',
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="h-8 gap-1.5 rounded-full font-sans text-xs font-semibold shadow-2xs transition-transform hover:scale-105"
                                                            disabled={isPending(
                                                                request.id,
                                                            )}
                                                            onClick={() =>
                                                                updateStatus(
                                                                    request.id,
                                                                    'cancelled',
                                                                )
                                                            }
                                                        >
                                                            {isPending(
                                                                request.id,
                                                            ) && (
                                                                <Spinner className="size-3.5" />
                                                            )}
                                                            {t(
                                                                'common.actions.cancel',
                                                            )}
                                                        </Button>
                                                    </div>
                                                )}
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
                        {t('staff.maintenance.showingCount', {
                            shown: requests.data.length,
                            total: requests.total,
                        })}
                    </p>
                    <Pagination meta={requests} />
                </div>
            </div>
        </>
    );
}

StaffMaintenanceIndex.layout = {
    breadcrumbs: [{ title: 'Maintenance', href: staffMaintenanceIndex() }],
};
