import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useTranslation } from '@/hooks/use-translation';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

const titleKeyMap: Record<string, string> = {
    'dashboard': 'nav.dashboard',
    'admin dashboard': 'adminDashboard.title',
    'reservations': 'nav.staff.reservations',
    'my reservations': 'nav.guest.myReservations',
    'invoices': 'nav.admin.invoices',
    'my invoices': 'nav.guest.myInvoices',
    'payments': 'nav.staff.payments',
    'my payments': 'nav.guest.myPayments',
    'rooms': 'nav.admin.rooms',
    'room status': 'nav.staff.roomStatus',
    'services': 'nav.admin.services',
    'staff': 'nav.admin.staffAccounts',
    'staff accounts': 'nav.admin.staffAccounts',
    'maintenance': 'nav.staff.maintenance',
    'settings': 'nav.admin.settings',
    'profile': 'settingsPage.profile.title',
    'security': 'settingsPage.security.title',
    'appearance': 'settingsPage.appearance.title',
    'notifications': 'notifications.title',
};

export function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: BreadcrumbItemType[];
}) {
    const { t } = useTranslation();

    const getTranslatedTitle = (title: string) => {
        if (!title) return '';
        const mappedKey = titleKeyMap[title.toLowerCase().trim()];
        if (mappedKey) {
            return t(mappedKey);
        }
        return title;
    };

    return (
        <>
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            const displayTitle = getTranslatedTitle(item.title);

                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage className="font-sans font-medium text-foreground text-[15px]">
                                                {displayTitle}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild className="font-sans text-[15px]">
                                                <Link href={item.href}>
                                                    {displayTitle}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </>
    );
}
