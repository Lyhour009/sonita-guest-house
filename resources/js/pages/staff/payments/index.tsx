import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import PaymentController from '@/actions/App/Http/Controllers/Staff/PaymentController';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { proof as proofShow } from '@/routes/payments';
import { index as staffPaymentsIndex } from '@/routes/staff/payments';
import type { Paginated, StaffPayment } from '@/types';

type Filters = {
    search: string | null;
    status: string | null;
};

type Props = {
    payments: Paginated<StaffPayment>;
    filters: Filters;
};

export default function StaffPaymentsIndex({ payments, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'any');

    const applyFilters = (next: Partial<Filters>) => {
        const nextSearch = next.search ?? search;
        const nextStatus = next.status ?? status;

        router.get(
            staffPaymentsIndex().url,
            {
                search: nextSearch || undefined,
                status: nextStatus === 'any' ? undefined : nextStatus,
            },
            {
                preserveState: true,
                replace: true,
                only: ['payments', 'filters'],
            },
        );
    };

    useEffect(() => {
        const timeout = setTimeout(() => applyFilters({ search }), 300);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const runAction = (url: string) => {
        router.patch(url, {}, { preserveScroll: true, only: ['payments'] });
    };

    return (
        <>
            <Head title="Payments" />

            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold">Payments</h1>

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        placeholder="Search by guest..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="max-w-xs"
                    />

                    <Select
                        value={status}
                        onValueChange={(value) => {
                            setStatus(value);
                            applyFilters({ status: value });
                        }}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Guest</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Proof</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground"
                                    >
                                        No payments match your filters.
                                    </TableCell>
                                </TableRow>
                            )}
                            {payments.data.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>
                                        {payment.guest.full_name}
                                    </TableCell>
                                    <TableCell>
                                        {payment.room.room_number}
                                    </TableCell>
                                    <TableCell>${payment.amount}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {payment.method}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {payment.has_proof ? (
                                            <Link
                                                href={proofShow(payment.id)}
                                                target="_blank"
                                                className="text-sm underline"
                                            >
                                                View
                                            </Link>
                                        ) : (
                                            '—'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {payment.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        runAction(
                                                            PaymentController.confirm.url(
                                                                payment.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    Confirm
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        runAction(
                                                            PaymentController.reject.url(
                                                                payment.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Pagination meta={payments} />
            </div>
        </>
    );
}

StaffPaymentsIndex.layout = {
    breadcrumbs: [{ title: 'Payments', href: staffPaymentsIndex() }],
};
