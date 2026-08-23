import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';

type Props = {
    status: string;
};

/**
 * Status badge for the real `Payment.status` enum (pending/confirmed/failed/refunded).
 * Distinct from `PaymentStatusBadge` in `reservation-badges.tsx`, which only handles the
 * reservation-context paid/pending/unpaid strings.
 */
export function PaymentStatusBadge({ status }: Props) {
    const { t } = useTranslation();

    switch (status) {
        case 'confirmed':
            return (
                <Badge
                    variant="outline"
                    className="border-success/40 bg-success/10 font-sans text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                >
                    {t('common.paymentStatus.confirmed')}
                </Badge>
            );
        case 'failed':
            return (
                <Badge
                    variant="outline"
                    className="border-danger/40 bg-danger/10 font-sans text-xs font-semibold text-rose-600 dark:text-rose-400"
                >
                    {t('common.paymentStatus.failed')}
                </Badge>
            );
        case 'refunded':
            return (
                <Badge
                    variant="outline"
                    className="border-info/40 bg-info/10 font-sans text-xs font-semibold text-blue-700 dark:text-blue-300"
                >
                    {t('common.paymentStatus.refunded')}
                </Badge>
            );
        default:
            return (
                <Badge
                    variant="outline"
                    className="border-warning/40 bg-warning/10 font-sans text-xs font-semibold text-amber-700 dark:text-amber-300"
                >
                    {t('common.paymentStatus.pending')}
                </Badge>
            );
    }
}
