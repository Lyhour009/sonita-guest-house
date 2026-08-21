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

    return (
        <>
            <Head title="Invoices" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Invoices</h1>
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
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="any">Any status</SelectItem>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                </Select>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Guest</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Billing period</TableHead>
                                <TableHead>Total</TableHead>
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
                                        colSpan={8}
                                        className="text-center text-muted-foreground"
                                    >
                                        No invoices match your filters.
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
                                            {invoice.invoice_type}
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
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="icon"
                                            title="Download PDF"
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
