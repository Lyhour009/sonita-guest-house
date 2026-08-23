import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';

export function ReservationStatusBadge({ status }: { status: string }) {
    const { t } = useTranslation();

    switch (status) {
        case 'confirmed':
            return (
                <Badge
                    variant="outline"
                    className="border-primary/40 bg-primary/10 font-sans text-xs font-semibold text-primary"
                >
                    {t('common.reservationStatus.confirmed')}
                </Badge>
            );
        case 'checked_in':
        case 'active':
            return (
                <Badge
                    variant="outline"
                    className="gap-1.5 border-success/40 bg-success/10 font-sans text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                >
                    <span className="size-1.5 animate-pulse rounded-full bg-success" />
                    {t(`common.reservationStatus.${status}`)}
                </Badge>
            );
        case 'checked_out':
            return (
                <Badge
                    variant="outline"
                    className="border-border bg-muted/50 font-sans text-xs text-muted-foreground"
                >
                    {t('common.reservationStatus.checked_out')}
                </Badge>
            );
        case 'cancelled':
            return (
                <Badge
                    variant="outline"
                    className="border-danger/40 bg-danger/10 font-sans text-xs text-rose-600 dark:text-rose-400"
                >
                    {t('common.reservationStatus.cancelled')}
                </Badge>
            );
        default:
            return (
                <Badge
                    variant="outline"
                    className="border-warning/40 bg-warning/10 font-sans text-xs font-semibold text-amber-700 dark:text-amber-300"
                >
                    {t('common.reservationStatus.pending')}
                </Badge>
            );
    }
}

export function PaymentStatusBadge({ status }: { status?: string }) {
    const { t } = useTranslation();

    switch (status) {
        case 'paid':
            return (
                <Badge
                    variant="outline"
                    className="gap-1 border-success/40 bg-success/10 font-sans text-[11px] font-semibold text-emerald-700 dark:text-emerald-300"
                >
                    <span className="size-1 rounded-full bg-success" />
                    {t('staff.reservations.paymentStatus.paid')}
                </Badge>
            );
        case 'pending':
            return (
                <Badge
                    variant="outline"
                    className="border-warning/40 bg-warning/10 font-sans text-[11px] font-semibold text-amber-700 dark:text-amber-300"
                >
                    {t('staff.reservations.paymentStatus.pending')}
                </Badge>
            );
        default:
            return (
                <Badge
                    variant="outline"
                    className="border-danger/40 bg-danger/10 font-sans text-[11px] font-semibold text-rose-600 dark:text-rose-400"
                >
                    {t('staff.reservations.paymentStatus.unpaid')}
                </Badge>
            );
    }
}
