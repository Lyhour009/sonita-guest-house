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
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { usePendingAction } from '@/hooks/use-pending-action';
import { useTranslation } from '@/hooks/use-translation';
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
    const { t } = useTranslation();
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

    const debouncedSearch = useDebouncedValue(search, 300);

    useEffect(() => {
        applyFilters({ search: debouncedSearch });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const { isPending, withPending } = usePendingAction();

    const runAction = (key: string, url: string) => {
        router.patch(
            url,
            {},
            withPending(key, { preserveScroll: true, only: ['payments'] }),
        );
    };

    return (
        <>
            <Head title={t('nav.staff.payments')} />

            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold">
                    {t('nav.staff.payments')}
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        placeholder={t('staff.payments.searchPlaceholder')}
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
                            <SelectValue
                                placeholder={t('common.labels.status')}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">
                                {t('staff.payments.anyStatus')}
                            </SelectItem>
                            <SelectItem value="pending">
                                {t('common.paymentStatus.pending')}
                            </SelectItem>
                            <SelectItem value="confirmed">
                                {t('common.paymentStatus.confirmed')}
                            </SelectItem>
                            <SelectItem value="failed">
                                {t('common.paymentStatus.failed')}
                            </SelectItem>
                            <SelectItem value="refunded">
                                {t('common.paymentStatus.refunded')}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    {t('common.labels.guest')}
                                </TableHead>
                                <TableHead>{t('common.labels.room')}</TableHead>
                                <TableHead>
                                    {t('staff.payments.table.amount')}
                                </TableHead>
                                <TableHead>
                                    {t('staff.payments.table.method')}
                                </TableHead>
                                <TableHead>
                                    {t('staff.payments.table.proof')}
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
                            {payments.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground"
                                    >
                                        {t('staff.payments.empty')}
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
                                            {t(
                                                `staff.payments.method.${payment.method}`,
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
                                                {t('staff.payments.viewProof')}
                                            </Link>
                                        ) : (
                                            '—'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {t(
                                                `common.paymentStatus.${payment.status}`,
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {payment.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    disabled={isPending(
                                                        payment.id,
                                                    )}
                                                    onClick={() =>
                                                        runAction(
                                                            payment.id,
                                                            PaymentController.confirm.url(
                                                                payment.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    {isPending(payment.id) && (
                                                        <Spinner className="mr-2" />
                                                    )}
                                                    {t(
                                                        'common.actions.confirm',
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={isPending(
                                                        payment.id,
                                                    )}
                                                    onClick={() =>
                                                        runAction(
                                                            payment.id,
                                                            PaymentController.reject.url(
                                                                payment.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    {isPending(payment.id) && (
                                                        <Spinner className="mr-2" />
                                                    )}
                                                    {t('staff.payments.reject')}
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
