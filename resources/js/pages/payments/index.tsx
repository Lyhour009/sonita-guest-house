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
import { useTranslation } from '@/hooks/use-translation';
import { index as paymentsIndex, proof as proofShow } from '@/routes/payments';
import type { Paginated, Payment } from '@/types';

type Props = {
    payments: Paginated<Payment>;
};

export default function PaymentsIndex({ payments }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title="My payments" />

            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold">
                    {t('payments.page.title')}
                </h1>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('common.labels.room')}</TableHead>
                                <TableHead>
                                    {t('payments.table.amount')}
                                </TableHead>
                                <TableHead>
                                    {t('payments.table.method')}
                                </TableHead>
                                <TableHead>
                                    {t('payments.table.submitted')}
                                </TableHead>
                                <TableHead>
                                    {t('common.labels.status')}
                                </TableHead>
                                <TableHead>
                                    {t('payments.table.proof')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center text-muted-foreground"
                                    >
                                        {t('payments.page.empty')}
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
                                            {t(
                                                `payments.method.${payment.method}`,
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{payment.created_at}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {t(
                                                `common.paymentStatus.${payment.status}`,
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {payment.has_proof ? (
                                            <Link
                                                href={proofShow(payment.id)}
                                                target="_blank"
                                                className="text-sm underline"
                                            >
                                                {t('payments.proof.view')}
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
