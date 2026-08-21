import { Head, router } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { useState } from 'react';
import LongStayInvoiceDialog from '@/components/longstay-invoice-dialog';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { useTranslation } from '@/hooks/use-translation';
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
    status: string | null;
};

type Props = {
    invoices: Paginated<AdminInvoice>;
    filters: Filters;
    activeLongStayReservations: ActiveLongStayReservationOption[];
};

export default function AdminInvoicesIndex({
    invoices,
    filters,
    activeLongStayReservations,
}: Props) {
    const [status, setStatus] = useState(filters.status ?? 'any');
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('adminInvoices.title')} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        {t('adminInvoices.title')}
                    </h1>
                    <LongStayInvoiceDialog
                        reservations={activeLongStayReservations}
                    />
                </div>

                <Select
                    value={status}
                    onValueChange={(value) => {
                        setStatus(value);
                        router.get(
                            adminInvoicesIndex().url,
                            { status: value === 'any' ? undefined : value },
                            {
                                preserveState: true,
                                replace: true,
                                only: ['invoices', 'filters'],
                            },
                        );
                    }}
                >
                    <SelectTrigger className="w-48">
                        <SelectValue
                            placeholder={t(
                                'adminInvoices.statusFilter.placeholder',
                            )}
                        />
                    </SelectTrigger>
                    <SelectContent>
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
                    </SelectContent>
                </Select>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    {t('common.labels.guest')}
                                </TableHead>
                                <TableHead>{t('common.labels.room')}</TableHead>
                                <TableHead>{t('common.labels.type')}</TableHead>
                                <TableHead>
                                    {t('adminInvoices.table.billingPeriod')}
                                </TableHead>
                                <TableHead>
                                    {t('common.labels.total')}
                                </TableHead>
                                <TableHead>
                                    {t('common.labels.dueDate')}
                                </TableHead>
                                <TableHead>
                                    {t('common.labels.status')}
                                </TableHead>
                                <TableHead className="text-right">
                                    {t('common.actions.actions')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center text-muted-foreground"
                                    >
                                        {t('adminInvoices.empty')}
                                    </TableCell>
                                </TableRow>
                            )}
                            {invoices.data.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell>
                                        {invoice.guest.full_name}
                                    </TableCell>
                                    <TableCell>
                                        {invoice.room.room_number}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {t(
                                                `common.reservationType.${invoice.invoice_type}`,
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {invoice.billing_period ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        ${invoice.total_amount}
                                    </TableCell>
                                    <TableCell>
                                        {invoice.due_date ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {t(
                                                `common.invoiceStatus.${invoice.status}`,
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="icon"
                                            title={t(
                                                'common.actions.downloadPdf',
                                            )}
                                        >
                                            <a
                                                href={
                                                    adminInvoicePdf(invoice.id)
                                                        .url
                                                }
                                            >
                                                <Download />
                                            </a>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Pagination meta={invoices} />
            </div>
        </>
    );
}

AdminInvoicesIndex.layout = {
    breadcrumbs: [{ title: 'Invoices', href: adminInvoicesIndex() }],
};
