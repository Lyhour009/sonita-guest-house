import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Eye,
    Receipt,
    Search,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import PaymentController from '@/actions/App/Http/Controllers/Staff/PaymentController';
import Pagination from '@/components/pagination';
import { PaymentStatusBadge } from '@/components/payment-badges';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { cn, getInitials } from '@/lib/utils';
import { proof as proofShow } from '@/routes/payments';
import { index as staffPaymentsIndex } from '@/routes/staff/payments';
import type { Paginated, StaffPayment } from '@/types';

type Filters = {
    search: string | null;
    status: string | null;
};

type StatusCounts = {
    all: number;
    pending: number;
    confirmed: number;
    stale: number;
};

type Props = {
    payments: Paginated<StaffPayment>;
    filters: Filters;
    statusCounts?: StatusCounts;
};

export default function StaffPaymentsIndex({
    payments,
    filters,
    statusCounts,
}: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'any');
    const [isFiltering, setIsFiltering] = useState(false);

    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            if (event.detail.visit.only?.includes('payments')) {
                setIsFiltering(true);
            }
        });
        const removeFinish = router.on('finish', (event) => {
            if (event.detail.visit.only?.includes('payments')) {
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

        router.get(
            staffPaymentsIndex().url,
            {
                search: nextSearch || undefined,
                status: nextStatus === 'any' ? undefined : nextStatus,
            },
            {
                preserveState: true,
                replace: true,
                only: ['payments', 'filters', 'statusCounts'],
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

    const runAction = (key: string, url: string) => {
        router.patch(
            url,
            {},
            withPending(key, {
                preserveScroll: true,
                only: ['payments', 'statusCounts'],
            }),
        );
    };

    return (
        <>
            <Head title={t('nav.staff.payments')} />

            <div className="w-full space-y-5 bg-background p-4 md:p-6">
                <div className="space-y-4">
                    <div className="pt-1">
                        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            {t('staff.payments.pageTitle')}
                        </h1>
                        <p className="mt-0.5 font-sans text-sm text-muted-foreground">
                            {t('staff.payments.subtitle')}
                        </p>
                    </div>

                    {/* Pulse KPI Metric Cards */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Receipt className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {statusCounts?.all || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('staff.payments.stats.total')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-warning/10 text-amber-600 dark:text-amber-400">
                                <Clock className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {statusCounts?.pending || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('common.paymentStatus.pending')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {statusCounts?.confirmed || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('common.paymentStatus.confirmed')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-rose-600 dark:text-rose-400">
                                <AlertTriangle className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {statusCounts?.stale || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('staff.payments.stale')}
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
                                    'staff.payments.searchPlaceholder',
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
                            <SelectTrigger className="h-10 w-full rounded-2xl border-border bg-background font-sans text-sm shadow-2xs sm:w-48">
                                <SelectValue
                                    placeholder={t('common.labels.status')}
                                />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border font-sans">
                                <SelectItem value="any">
                                    {t('staff.payments.anyStatus')}
                                </SelectItem>
                                <SelectItem value="pending">
                                    {t('common.paymentStatus.pending')}
                                </SelectItem>
                                <SelectItem value="confirmed">
                                    {t('common.paymentStatus.confirmed')}
                                </SelectItem>
                                <SelectItem value="failed">
                                    {t('common.paymentStatus.failed')}
                                </SelectItem>
                                <SelectItem value="refunded">
                                    {t('common.paymentStatus.refunded')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
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
                                        {t('common.labels.guest')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.room')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('staff.payments.table.amount')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('staff.payments.table.outstanding')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('staff.payments.table.method')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('staff.payments.table.submitted')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('staff.payments.table.proof')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.status')}
                                    </TableHead>
                                    <TableHead className="h-13 py-4 pr-6 text-right font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.actions.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border/60">
                                {payments.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={9}
                                            className="py-24 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="flex size-16 items-center justify-center rounded-3xl bg-muted shadow-inner">
                                                    <Receipt className="size-8 text-muted-foreground opacity-50" />
                                                </div>
                                                <p className="font-sans text-sm font-bold text-foreground">
                                                    {t('staff.payments.empty')}
                                                </p>
                                                <p className="max-w-sm font-sans text-sm text-muted-foreground">
                                                    {t(
                                                        'staff.payments.emptyDescription',
                                                    )}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payments.data.map((payment) => (
                                        <TableRow
                                            key={payment.id}
                                            className="h-16 transition-all duration-300 hover:bg-primary/5"
                                        >
                                            <TableCell className="py-3.5 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="size-9.5 rounded-xl">
                                                        <AvatarFallback className="rounded-xl bg-primary/10 font-sans text-xs font-bold text-primary">
                                                            {getInitials(
                                                                payment.guest
                                                                    .full_name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <p className="truncate font-sans text-sm font-bold text-foreground">
                                                            {
                                                                payment.guest
                                                                    .full_name
                                                            }
                                                        </p>
                                                        <p className="truncate font-sans text-xs text-muted-foreground">
                                                            {
                                                                payment.guest
                                                                    .email
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-sm text-foreground">
                                                {payment.room.room_number}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <div className="flex items-center gap-1.5 font-sans text-sm font-semibold text-foreground">
                                                    ${payment.amount}
                                                    {payment.status ===
                                                        'pending' &&
                                                        payment.settles_invoice && (
                                                            <span
                                                                title={t(
                                                                    'staff.payments.settlesInvoice',
                                                                )}
                                                            >
                                                                <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                                                            </span>
                                                        )}
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'px-4 py-3.5 font-sans text-sm',
                                                    payment.invoice
                                                        .outstanding_balance > 0
                                                        ? 'text-foreground'
                                                        : 'text-muted-foreground',
                                                )}
                                            >
                                                $
                                                {payment.invoice.outstanding_balance.toFixed(
                                                    2,
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <Badge
                                                    variant="secondary"
                                                    className="font-sans text-xs"
                                                >
                                                    {t(
                                                        `staff.payments.method.${payment.method}`,
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <div className="flex items-center gap-1.5 font-sans text-sm text-muted-foreground">
                                                    {payment.created_at ?? '—'}
                                                    {payment.is_stale && (
                                                        <Badge
                                                            variant="outline"
                                                            className="border-danger/40 bg-danger/10 font-sans text-[10px] font-semibold text-rose-600 dark:text-rose-400"
                                                        >
                                                            {t(
                                                                'staff.payments.stale',
                                                            )}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                {payment.has_proof ? (
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="sm"
                                                        className="size-8 rounded-full p-0 font-sans text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title={t(
                                                            'staff.payments.viewProof',
                                                        )}
                                                    >
                                                        <a
                                                            href={
                                                                proofShow(
                                                                    payment.id,
                                                                ).url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Eye className="size-4" />
                                                        </a>
                                                    </Button>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <PaymentStatusBadge
                                                    status={payment.status}
                                                />
                                            </TableCell>
                                            <TableCell className="py-3.5 pr-6 text-right">
                                                {payment.status ===
                                                    'pending' && (
                                                    <div className="flex justify-end gap-1.5">
                                                        <Button
                                                            size="sm"
                                                            className="h-8 gap-1.5 rounded-full bg-primary font-sans text-xs font-semibold text-primary-foreground shadow-2xs transition-transform hover:scale-105"
                                                            disabled={isPending(
                                                                payment.id,
                                                            )}
                                                            onClick={() =>
                                                                runAction(
                                                                    payment.id,
                                                                    PaymentController.confirm.url(
                                                                        payment.id,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            {isPending(
                                                                payment.id,
                                                            ) && (
                                                                <Spinner className="size-3.5" />
                                                            )}
                                                            {t(
                                                                'common.actions.confirm',
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="h-8 gap-1.5 rounded-full font-sans text-xs font-semibold shadow-2xs transition-transform hover:scale-105"
                                                            disabled={isPending(
                                                                payment.id,
                                                            )}
                                                            onClick={() =>
                                                                runAction(
                                                                    payment.id,
                                                                    PaymentController.reject.url(
                                                                        payment.id,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            {isPending(
                                                                payment.id,
                                                            ) && (
                                                                <Spinner className="size-3.5" />
                                                            )}
                                                            {t(
                                                                'staff.payments.reject',
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
                        {t('staff.payments.showingCount', {
                            shown: payments.data.length,
                            total: payments.total,
                        })}
                    </p>
                    <Pagination meta={payments} />
                </div>
            </div>
        </>
    );
}

StaffPaymentsIndex.layout = {
    breadcrumbs: [{ title: 'Payments', href: staffPaymentsIndex() }],
};
