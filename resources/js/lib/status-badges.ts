import { AlertTriangle, CheckCircle2, Clock, Wallet } from 'lucide-react';

type Translate = (
    key: string,
    params?: Record<string, string | number>,
) => string;

/** Status → color mapping shared between the guest dashboard and the reservations list. */
export function getReservationStatusInfo(t: Translate, status: string) {
    const label = t(`common.reservationStatus.${status}`);

    switch (status) {
        case 'confirmed':
            return {
                className: 'border-primary/40 bg-primary/10 text-primary',
                pulse: false,
                label,
            };
        case 'checked_in':
        case 'active':
            return {
                className:
                    'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                pulse: true,
                label,
            };
        case 'checked_out':
        case 'expired':
            return {
                className: 'border-border bg-muted/50 text-muted-foreground',
                pulse: false,
                label,
            };
        case 'cancelled':
        case 'terminated':
            return {
                className:
                    'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400',
                pulse: false,
                label,
            };
        default:
            return {
                className:
                    'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
                pulse: false,
                label,
            };
    }
}

/** Status → color mapping shared between the guest dashboard and the invoices list. */
export function getInvoiceStatusInfo(t: Translate, status: string) {
    switch (status) {
        case 'paid':
            return {
                icon: CheckCircle2,
                iconClass:
                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                badgeClassName:
                    'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                label: t('common.invoiceStatus.paid'),
            };
        case 'partial':
            return {
                icon: Wallet,
                iconClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                badgeClassName:
                    'border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300',
                label: t('common.invoiceStatus.partial'),
            };
        case 'overdue':
            return {
                icon: AlertTriangle,
                iconClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                badgeClassName:
                    'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400',
                label: t('common.invoiceStatus.overdue'),
            };
        default:
            return {
                icon: Clock,
                iconClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                badgeClassName:
                    'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
                label: t('common.invoiceStatus.unpaid'),
            };
    }
}
