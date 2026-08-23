import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';

type Props = {
    status: string;
    isOverdue?: boolean;
};

export function InvoiceStatusBadge({ status, isOverdue }: Props) {
    const { t } = useTranslation();

    if (isOverdue) {
        return (
            <Badge
                variant="outline"
                className="gap-1.5 border-danger/40 bg-danger/10 font-sans text-xs font-semibold text-rose-600 dark:text-rose-400"
            >
                <span className="size-1.5 animate-pulse rounded-full bg-danger" />
                {t('common.invoiceStatus.overdue')}
            </Badge>
        );
    }

    switch (status) {
        case 'paid':
            return (
                <Badge
                    variant="outline"
                    className="border-success/40 bg-success/10 font-sans text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                >
                    {t('common.invoiceStatus.paid')}
                </Badge>
            );
        case 'partial':
            return (
                <Badge
                    variant="outline"
                    className="border-info/40 bg-info/10 font-sans text-xs font-semibold text-blue-700 dark:text-blue-300"
                >
                    {t('common.invoiceStatus.partial')}
                </Badge>
            );
        default:
            return (
                <Badge
                    variant="outline"
                    className="border-warning/40 bg-warning/10 font-sans text-xs font-semibold text-amber-700 dark:text-amber-300"
                >
                    {t('common.invoiceStatus.unpaid')}
                </Badge>
            );
    }
}
