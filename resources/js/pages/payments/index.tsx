import { Head, Link } from '@inertiajs/react';
import { CreditCard, FileText } from 'lucide-react';
import Pagination from '@/components/pagination';
import { PaymentStatusBadge } from '@/components/payment-badges';
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
            <Head title={t('payments.page.title')} />

            <div className="w-full space-y-5 bg-background p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                        {t('payments.page.title')}
                    </h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {t('payments.page.subtitle')}
                    </p>
                </div>

                {payments.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-border/50 bg-card/50 py-24 text-center shadow-sm backdrop-blur-sm">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-3xl bg-muted shadow-inner">
                            <CreditCard className="size-8 text-muted-foreground opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                            {t('payments.page.empty')}
                        </h3>
                        <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">
                            {t('payments.page.emptyDescription')}
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
                                        {t('payments.table.amount')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('payments.table.method')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('payments.table.submitted')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.status')}
                                    </TableHead>
                                    <TableHead className="h-13 py-4 pr-6 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('payments.table.proof')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border/60">
                                {payments.data.map((payment) => (
                                    <TableRow
                                        key={payment.id}
                                        className="h-16 transition-all duration-300 hover:bg-primary/5"
                                    >
                                        <TableCell className="py-3.5 pl-6">
                                            <span className="flex h-8 min-w-10 items-center justify-center rounded-xl border border-border/90 bg-background px-2.5 text-[13px] font-bold text-foreground shadow-2xs">
                                                #{payment.room.room_number}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5 text-sm font-semibold text-foreground">
                                            ${payment.amount}
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5">
                                            <Badge
                                                variant="outline"
                                                className="font-normal"
                                            >
                                                {t(
                                                    `payments.method.${payment.method}`,
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5 text-sm text-muted-foreground">
                                            {payment.created_at}
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5">
                                            <PaymentStatusBadge
                                                status={payment.status}
                                            />
                                        </TableCell>
                                        <TableCell className="py-3.5 pr-6">
                                            {payment.has_proof ? (
                                                <Link
                                                    href={proofShow(payment.id)}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                                                >
                                                    <FileText className="size-3.5" />
                                                    {t('payments.proof.view')}
                                                </Link>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <Pagination meta={payments} />
            </div>
        </>
    );
}

PaymentsIndex.layout = {
    breadcrumbs: [{ title: 'My payments', href: paymentsIndex() }],
};
