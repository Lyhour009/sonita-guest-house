import { Head, Link } from '@inertiajs/react';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { index as paymentsIndex, proof as proofShow } from '@/routes/payments';
import type { Paginated, Payment } from '@/types';

type Props = {
    payments: Paginated<Payment>;
};

export default function PaymentsIndex({ payments }: Props) {
    return (
        <>
            <Head title="My payments" />

            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold">My payments</h1>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Proof</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center text-muted-foreground"
                                    >
                                        You haven't submitted any payments yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {payments.data.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>
                                        {payment.room.room_number}
                                    </TableCell>
                                    <TableCell>${payment.amount}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {payment.method}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{payment.created_at}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {payment.status}
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

PaymentsIndex.layout = {
    breadcrumbs: [{ title: 'My payments', href: paymentsIndex() }],
};
