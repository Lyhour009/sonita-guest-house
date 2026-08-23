import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';

export function MaintenanceStatusBadge({ status }: { status: string }) {
    const { t } = useTranslation();

    switch (status) {
        case 'in_progress':
            return (
                <Badge
                    variant="outline"
                    className="border-info/40 bg-info/10 font-sans text-xs font-semibold text-blue-700 dark:text-blue-300"
                >
                    {t('common.maintenanceStatus.in_progress')}
                </Badge>
            );
        case 'resolved':
            return (
                <Badge
                    variant="outline"
                    className="border-success/40 bg-success/10 font-sans text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                >
                    {t('common.maintenanceStatus.resolved')}
                </Badge>
            );
        case 'cancelled':
            return (
                <Badge
                    variant="outline"
                    className="border-border bg-muted/50 font-sans text-xs text-muted-foreground"
                >
                    {t('common.maintenanceStatus.cancelled')}
                </Badge>
            );
        default:
            return (
                <Badge
                    variant="outline"
                    className="border-warning/40 bg-warning/10 font-sans text-xs font-semibold text-amber-700 dark:text-amber-300"
                >
                    {t('common.maintenanceStatus.pending')}
                </Badge>
            );
    }
}

export function MaintenancePriorityBadge({ priority }: { priority: string }) {
    const { t } = useTranslation();

    switch (priority) {
        case 'high':
            return (
                <Badge
                    variant="outline"
                    className="border-danger/40 bg-danger/10 font-sans text-xs font-semibold text-rose-600 dark:text-rose-400"
                >
                    {t('common.maintenancePriority.high')}
                </Badge>
            );
        case 'medium':
            return (
                <Badge
                    variant="outline"
                    className="border-warning/40 bg-warning/10 font-sans text-xs font-semibold text-amber-700 dark:text-amber-300"
                >
                    {t('common.maintenancePriority.medium')}
                </Badge>
            );
        default:
            return (
                <Badge
                    variant="outline"
                    className="border-border bg-muted/50 font-sans text-xs text-muted-foreground"
                >
                    {t('common.maintenancePriority.low')}
                </Badge>
            );
    }
}
