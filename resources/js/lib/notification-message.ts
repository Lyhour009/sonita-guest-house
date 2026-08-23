import type { AppNotification } from '@/types';

type Translate = (
    key: string,
    params?: Record<string, string | number>,
) => string;

export function resolveNotificationMessage(
    t: Translate,
    notification: Pick<AppNotification, 'type' | 'data'>,
): string {
    const params: Record<string, string | number> = {
        ...(notification.data ?? {}),
    };

    if (notification.type === 'maintenance_status_changed' && params.status) {
        params.status = t(`common.maintenanceStatus.${params.status}`);
    }

    return t(`notifications.messages.${notification.type}`, params);
}
