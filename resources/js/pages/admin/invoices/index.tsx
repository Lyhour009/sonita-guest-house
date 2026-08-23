import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Clock,
    Download,
    Receipt,
    Search,
    Wallet,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { InvoiceStatusBadge } from '@/components/invoice-badges';
import LongStayInvoiceDialog from '@/components/longstay-invoice-dialog';
import Pagination from '@/components/pagination';
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
import { cn, getInitials } from '@/lib/utils';
import {
    index as adminInvoicesIndex,
    pdf as adminInvoicePdf,
} from '@/routes/admin/invoices';
import type {
    ActiveLongStayReservationOption,
    AdminInvoice,
    Paginated,
} from '@/types';

type Filters = {
    search: string | null;
    status: string | null;
};

type StatusCounts = {
    all: number;
    unpaid: number;
    partial: number;
    overdue: number;
};

type Props = {
    invoices: Paginated<AdminInvoice>;
    filters: Filters;
    statusCounts?: StatusCounts;
    activeLongStayReservations: ActiveLongStayReservationOption[];
};

export default function AdminInvoicesIndex({
    invoices,
    filters,
    statusCounts,
    activeLongStayReservations,
}: Props) {
    const { t } = useTranslation();

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'any');
    const [isFiltering, setIsFiltering] = useState(false);

    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            if (event.detail.visit.only?.includes('invoices')) {
                setIsFiltering(true);
            }
        });
        const removeFinish = router.on('finish', (event) => {
            if (event.detail.visit.only?.includes('invoices')) {
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
            adminInvoicesIndex().url,
            {
                search: nextSearch || undefined,
                status: nextStatus === 'any' ? undefined : nextStatus,
            },
            {
                preserveState: true,
                replace: true,
                only: ['invoices', 'filters', 'statusCounts'],
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

    return (
        <>
            <Head title={t('adminInvoices.title')} />

            <div className="w-full space-y-5 bg-background p-4 md:p-6">
                <div className="space-y-4">
                    <div className="pt-1">
                        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            {t('adminInvoices.title')}
                        </h1>
                        <p className="mt-0.5 font-sans text-sm text-muted-foreground">
                            {t('adminInvoices.subtitle')}
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
                                    {t('adminInvoices.stats.total')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-warning/10 text-amber-600 dark:text-amber-400">
                                <Clock className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {statusCounts?.unpaid || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('common.invoiceStatus.unpaid')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-info/10 text-blue-600 dark:text-blue-400">
                                <Wallet className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {statusCounts?.partial || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('common.invoiceStatus.partial')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-rose-600 dark:text-rose-400">
                                <AlertTriangle className="size-4.5" />
                            </div>
                            <div>
                                <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                    {statusCounts?.overdue || 0}
                                </p>
                                <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {t('common.invoiceStatus.overdue')}
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
                                    'adminInvoices.searchPlaceholder',
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
                                    {t('adminInvoices.statusFilter.any')}
                                </SelectItem>
                                <SelectItem value="unpaid">
                                    {t('common.invoiceStatus.unpaid')}
                                </SelectItem>
                                <SelectItem value="partial">
                                    {t('common.invoiceStatus.partial')}
                                </SelectItem>
                                <SelectItem value="paid">
                                    {t('common.invoiceStatus.paid')}
                                </SelectItem>
                                <SelectItem value="overdue">
                                    {t('common.invoiceStatus.overdue')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <LongStayInvoiceDialog
                        reservations={activeLongStayReservations}
                    />
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
                                        {t('common.labels.type')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('adminInvoices.table.billingPeriod')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.total')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('adminInvoices.table.outstanding')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.dueDate')}
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
                                {invoices.data.length === 0 ? (
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
                                                    {t('adminInvoices.empty')}
                                                </p>
                                                <p className="max-w-sm font-sans text-sm text-muted-foreground">
                                                    {t(
                                                        'adminInvoices.emptyDescription',
                                                    )}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    invoices.data.map((invoice) => (
                                        <TableRow
                                            key={invoice.id}
                                            className="h-16 transition-all duration-300 hover:bg-primary/5"
                                        >
                                            <TableCell className="py-3.5 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="size-9.5 rounded-xl">
                                                        <AvatarFallback className="rounded-xl bg-primary/10 font-sans text-xs font-bold text-primary">
                                                            {getInitials(
                                                                invoice.guest
                                                                    .full_name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <p className="truncate font-sans text-sm font-bold text-foreground">
                                                        {
                                                            invoice.guest
                                                                .full_name
                                                        }
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-sm text-foreground">
                                                {invoice.room.room_number}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <Badge
                                                    variant="secondary"
                                                    className="font-sans text-xs"
                                                >
                                                    {t(
                                                        `common.reservationType.${invoice.invoice_type}`,
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-sm text-muted-foreground">
                                                {invoice.billing_period ?? '—'}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-sm font-semibold text-foreground">
                                                ${invoice.total_amount}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'px-4 py-3.5 font-sans text-sm font-semibold',
                                                    invoice.outstanding_balance >
                                                        0
                                                        ? invoice.is_overdue
                                                            ? 'text-rose-600 dark:text-rose-400'
                                                            : 'text-foreground'
                                                        : 'text-muted-foreground',
                                                )}
                                            >
                                                $
                                                {invoice.outstanding_balance.toFixed(
                                                    2,
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'px-4 py-3.5 font-sans text-sm',
                                                    invoice.is_overdue
                                                        ? 'font-semibold text-rose-600 dark:text-rose-400'
                                                        : 'text-muted-foreground',
                                                )}
                                            >
                                                {invoice.due_date ?? '—'}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <InvoiceStatusBadge
                                                    status={invoice.status}
                                                    isOverdue={
                                                        invoice.is_overdue
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="py-3.5 pr-6 text-right">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="sm"
                                                    className="size-8 rounded-full p-0 font-sans text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    title={t(
                                                        'common.actions.downloadPdf',
                                                    )}
                                                >
                                                    <a
                                                        href={
                                                            adminInvoicePdf(
                                                                invoice.id,
                                                            ).url
                                                        }
                                                    >
                                                        <Download className="size-4" />
                                                    </a>
                                                </Button>
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
                        {t('adminInvoices.showingCount', {
                            shown: invoices.data.length,
                            total: invoices.total,
                        })}
                    </p>
                    <Pagination meta={invoices} />
                </div>
            </div>
        </>
    );
}

AdminInvoicesIndex.layout = {
    breadcrumbs: [{ title: 'Invoices', href: adminInvoicesIndex() }],
};
