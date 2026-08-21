import { Head } from '@inertiajs/react';
import { Download } from 'lucide-react';
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

            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold">
                    {t('invoices.page.title')}
                </h1>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('common.labels.room')}</TableHead>
                                <TableHead>{t('common.labels.type')}</TableHead>
                                <TableHead>
                                    {t('common.labels.total')}
                                </TableHead>
                                <TableHead>
                                    {t('invoices.table.outstanding')}
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
                                        colSpan={7}
                                        className="text-center text-muted-foreground"
                                    >
                                        {t('invoices.page.empty')}
                                    </TableCell>
                                </TableRow>
                            )}
                            {invoices.data.map((invoice) => (
                                <TableRow key={invoice.id}>
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
                                        ${invoice.total_amount}
                                    </TableCell>
                                    <TableCell>
                                        ${invoice.outstanding_balance}
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
                                        <div className="flex items-center justify-end gap-2">
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
                                                        invoicePdf(invoice.id)
                                                            .url
                                                    }
                                                >
                                                    <Download />
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
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Pagination meta={invoices} />
            </div>
        </>
    );
}

InvoicesIndex.layout = {
    breadcrumbs: [{ title: 'My invoices', href: invoicesIndex() }],
};
