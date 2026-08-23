import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';

export function StaffRoleBadge({ role }: { role: string }) {
    const { t } = useTranslation();

    if (role === 'housekeeping') {
        return (
            <Badge
                variant="outline"
                className="border-primary/40 bg-primary/10 font-sans text-xs font-semibold text-primary"
            >
                {t('staffAccounts.roles.housekeeping')}
            </Badge>
        );
    }

    return (
        <Badge
            variant="outline"
            className="border-info/40 bg-info/10 font-sans text-xs font-semibold text-blue-700 dark:text-blue-300"
        >
            {t('staffAccounts.roles.receptionist')}
        </Badge>
    );
}
