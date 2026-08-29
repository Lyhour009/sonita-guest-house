import { Head } from '@inertiajs/react';
import { Download, FileText } from 'lucide-react';
import Pagination from '@/components/pagination';
import PaymentSubmitDialog from '@/components/payment-submit-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import { getInvoiceStatusInfo } from '@/lib/status-badges';
import { cn } from '@/lib/utils';
import { index as invoicesIndex, pdf as invoicePdf } from '@/routes/invoices';
import type { Invoice, Paginated } from '@/types';

type Props = {
    invoices: Paginated<Invoice>;
};

const payableStatuses = ['unpaid', 'partial'];

export default function InvoicesIndex({ invoices }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('invoices.page.title')} />

            <div className="w-full space-y-5 bg-background p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                        {t('invoices.page.title')}
                    </h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {t('invoices.page.subtitle')}
                    </p>
                </div>

                {invoices.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-border/50 bg-card/50 py-24 text-center shadow-sm backdrop-blur-sm">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-3xl bg-muted shadow-inner">
                            <FileText className="size-8 text-muted-foreground opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                            {t('invoices.page.empty')}
                        </h3>
                        <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">
                            {t('invoices.page.emptyDescription')}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-md">
                        <Table>
                            <TableHeader className="border-b border-border bg-muted/50">
                                <TableRow className="h-13 border-border hover:bg-transparent">
                                    <TableHead className="h-13 py-4 pl-6 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.room')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.type')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.total')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('invoices.table.outstanding')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.dueDate')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.status')}
                                    </TableHead>
                                    <TableHead className="h-13 py-4 pr-6 text-right text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.actions.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border/60">
                                {invoices.data.map((invoice) => {
                                    const statusInfo = getInvoiceStatusInfo(
                                        t,
                                        invoice.status,
                                    );

                                    const needsPayment = [
                                        'unpaid',
                                        'partial',
                                        'overdue',
                                    ].includes(invoice.status);

                                    return (
                                        <TableRow
                                            key={invoice.id}
                                            className={cn(
                                                'h-16 transition-all duration-300 hover:bg-primary/5',
                                                needsPayment &&
                                                    'border-l-2 border-l-warning bg-warning/5 hover:bg-warning/10',
                                            )}
                                        >
                                            <TableCell className="py-3.5 pl-6">
                                                <span className="flex h-8 min-w-10 items-center justify-center rounded-xl border border-border/90 bg-background px-2.5 text-[13px] font-bold text-foreground shadow-2xs">
                                                    #{invoice.room.room_number}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <Badge
                                                    variant="outline"
                                                    className="font-normal"
                                                >
                                                    {t(
                                                        `common.reservationType.${invoice.invoice_type}`,
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-sm font-semibold text-foreground">
                                                ${invoice.total_amount}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-sm font-semibold text-foreground">
                                                ${invoice.outstanding_balance}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-sm text-muted-foreground">
                                                {invoice.due_date ?? '—'}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'gap-1.5 font-semibold',
                                                        statusInfo.badgeClassName,
                                                    )}
                                                >
                                                    <statusInfo.icon className="size-3.5" />
                                                    {statusInfo.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-3.5 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="icon"
                                                        className="size-8 rounded-full"
                                                        title={t(
                                                            'common.actions.downloadPdf',
                                                        )}
                                                    >
                                                        <a
                                                            href={
                                                                invoicePdf(
                                                                    invoice.id,
                                                                ).url
                                                            }
                                                        >
                                                            <Download className="size-4" />
                                                        </a>
                                                    </Button>
                                                    {payableStatuses.includes(
                                                        invoice.status,
                                                    ) && (
                                                        <PaymentSubmitDialog
                                                            invoice={invoice}
                                                        />
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <Pagination meta={invoices} />
            </div>
        </>
    );
}

InvoicesIndex.layout = {
    breadcrumbs: [{ title: 'My invoices', href: invoicesIndex() }],
};
