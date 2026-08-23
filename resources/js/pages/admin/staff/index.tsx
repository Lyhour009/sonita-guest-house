import { Head, router } from '@inertiajs/react';
import {
    Pencil,
    Search,
    Sparkles,
    Trash2,
    UserCog,
    Users,
    Wrench,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Pagination from '@/components/pagination';
import { StaffRoleBadge } from '@/components/staff-badges';
import StaffCreateDialog from '@/components/staff-create-dialog';
import StaffEditDialog from '@/components/staff-edit-dialog';
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
import { destroy, index as adminStaffIndex } from '@/routes/admin/staff';
import type { Paginated, StaffAccount, StaffStats } from '@/types';

type Filters = {
    search: string | null;
    role: string | null;
};

type Props = {
    staff: Paginated<StaffAccount>;
    filters: Filters;
    stats?: StaffStats;
};

export default function AdminStaffIndex({ staff, filters, stats }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState(filters.role ?? 'any');
    const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
    const [isFiltering, setIsFiltering] = useState(false);

    const editingStaff = useMemo(
        () => staff.data.find((member) => member.id === editingStaffId) ?? null,
        [staff.data, editingStaffId],
    );

    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            if (event.detail.visit.only?.includes('staff')) {
                setIsFiltering(true);
            }
        });
        const removeFinish = router.on('finish', (event) => {
            if (event.detail.visit.only?.includes('staff')) {
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
        const nextRole = next.role !== undefined ? next.role : role;

        router.get(
            adminStaffIndex().url,
            {
                search: nextSearch || undefined,
                role: nextRole === 'any' ? undefined : nextRole,
            },
            {
                preserveState: true,
                replace: true,
                only: ['staff', 'filters', 'stats'],
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

    const deleteStaff = (staffId: string) => {
        router.delete(
            destroy(staffId).url,
            withPending(`delete-${staffId}`, {
                preserveScroll: true,
                only: ['staff', 'stats'],
            }),
        );
    };

    return (
        <>
            <Head title={t('staffAccounts.title')} />

            <div className="w-full space-y-5 bg-background p-4 md:p-6">
                <div className="space-y-4">
                    <div className="pt-1">
                        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            {t('staffAccounts.title')}
                        </h1>
                        <p className="mt-0.5 font-sans text-sm text-muted-foreground">
                            {t('staffAccounts.subtitle')}
                        </p>
                    </div>

                    {/* Pulse KPI Metric Cards */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Users className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {stats?.total || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('staffAccounts.stats.total')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-info/10 text-blue-600 dark:text-blue-400">
                                <UserCog className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {stats?.receptionists || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('staffAccounts.stats.receptionists')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Sparkles className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {stats?.housekeeping || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('staffAccounts.stats.housekeeping')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-warning/10 text-amber-600 dark:text-amber-400">
                                <Wrench className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {stats?.openAssignments || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('staffAccounts.stats.openAssignments')}
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
                                placeholder={t(
                                    'staffAccounts.searchPlaceholder',
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
                            value={role}
                            onValueChange={(value) => {
                                setRole(value);
                                applyFilters({ role: value });
                            }}
                        >
                            <SelectTrigger className="h-10 w-full rounded-2xl border-border bg-background font-sans text-sm shadow-2xs sm:w-48">
                                <SelectValue
                                    placeholder={t(
                                        'staffAccounts.filters.role',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border font-sans">
                                <SelectItem value="any">
                                    {t('staffAccounts.filters.anyRole')}
                                </SelectItem>
                                <SelectItem value="receptionist">
                                    {t('staffAccounts.roles.receptionist')}
                                </SelectItem>
                                <SelectItem value="housekeeping">
                                    {t('staffAccounts.roles.housekeeping')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <StaffCreateDialog />
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
                                        {t('staffAccounts.table.name')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('staffAccounts.table.email')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('staffAccounts.table.phone')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('staffAccounts.filters.role')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('staffAccounts.table.workload')}
                                    </TableHead>
                                    <TableHead className="h-13 py-4 pr-6 text-right font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.actions.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border/60">
                                {staff.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-24 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="flex size-16 items-center justify-center rounded-3xl bg-muted shadow-inner">
                                                    <Users className="size-8 text-muted-foreground opacity-50" />
                                                </div>
                                                <p className="font-sans text-sm font-bold text-foreground">
                                                    {t('staffAccounts.empty')}
                                                </p>
                                                <p className="max-w-sm font-sans text-sm text-muted-foreground">
                                                    {t(
                                                        'staffAccounts.emptyDescription',
                                                    )}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    staff.data.map((member) => (
                                        <TableRow
                                            key={member.id}
                                            className="h-16 transition-all duration-300 hover:bg-primary/5"
                                        >
                                            <TableCell className="py-3.5 pl-6 font-sans text-sm font-bold text-foreground">
                                                {member.full_name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-sm text-muted-foreground">
                                                {member.email}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-sm text-muted-foreground">
                                                {member.phone_number ?? '—'}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <StaffRoleBadge
                                                    role={member.role}
                                                />
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                {member.assigned_open_count !==
                                                null ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-sans text-sm text-foreground">
                                                            {t(
                                                                'staffAccounts.workloadOpen',
                                                                {
                                                                    count: member.assigned_open_count,
                                                                },
                                                            )}
                                                        </span>
                                                        {(member.assigned_overdue_count ??
                                                            0) > 0 && (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-danger/40 bg-danger/10 font-sans text-[10px] font-semibold text-rose-600 dark:text-rose-400"
                                                            >
                                                                {t(
                                                                    'staffAccounts.overdue',
                                                                )}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="font-sans text-sm text-muted-foreground">
                                                        {t(
                                                            'staffAccounts.workloadNone',
                                                        )}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-3.5 pr-6 text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 rounded-full font-sans text-xs font-semibold"
                                                        onClick={() =>
                                                            setEditingStaffId(
                                                                member.id,
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="size-3.5" />
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
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                                {t(
                                                                    'common.actions.delete',
                                                                )}
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    {t(
                                                                        'staffAccounts.deleteAccount.title',
                                                                        {
                                                                            name: member.full_name,
                                                                        },
                                                                    )}
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    {t(
                                                                        'staffAccounts.deleteAccount.description',
                                                                    )}
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    <X className="mr-2 size-4" />
                                                                    {t(
                                                                        'common.actions.cancel',
                                                                    )}
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    variant="destructive"
                                                                    disabled={isPending(
                                                                        `delete-${member.id}`,
                                                                    )}
                                                                    onClick={() =>
                                                                        deleteStaff(
                                                                            member.id,
                                                                        )
                                                                    }
                                                                >
                                                                    {isPending(
                                                                        `delete-${member.id}`,
                                                                    ) ? (
                                                                        <Spinner className="mr-2" />
                                                                    ) : (
                                                                        <Trash2 className="mr-2 size-4" />
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
                        {t('staffAccounts.showingCount', {
                            shown: staff.data.length,
                            total: staff.total,
                        })}
                    </p>
                    <Pagination meta={staff} />
                </div>
            </div>

            <StaffEditDialog
                staff={editingStaff}
                onOpenChange={(open) => !open && setEditingStaffId(null)}
            />
        </>
    );
}

AdminStaffIndex.layout = {
    breadcrumbs: [{ title: 'Staff', href: adminStaffIndex() }],
};
