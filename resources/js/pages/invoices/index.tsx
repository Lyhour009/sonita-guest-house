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
import { index as invoicesIndex, pdf as invoicePdf } from '@/routes/invoices';
import type { Invoice, Paginated } from '@/types';

type Props = {
    invoices: Paginated<Invoice>;
};

const payableStatuses = ['unpaid', 'partial'];

export default function InvoicesIndex({ invoices }: Props) {
    return (
        <>
            <Head title="My invoices" />

            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold">My invoices</h1>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Outstanding</TableHead>
                                <TableHead>Due date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
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
                                        You have no invoices yet.
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
                                            {invoice.invoice_type}
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
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="icon"
                                                title="Download PDF"
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
