import { Head, Link } from '@inertiajs/react';
import { OccupancyBreakdownChart } from '@/components/charts/occupancy-breakdown-chart';
import { RevenueTrendChart } from '@/components/charts/revenue-trend-chart';
import { useTranslation } from '@/hooks/use-translation';
import { index as adminDashboardIndex } from '@/routes/admin/dashboard';
import { index as adminInvoicesIndex } from '@/routes/admin/invoices';
import { index as staffMaintenanceIndex } from '@/routes/staff/maintenance';
import type { AdminDashboardData } from '@/types';

type Props = AdminDashboardData;

function StatCard({
    label,
    value,
    href,
}: {
    label: string;
    value: number | string;
    href?: string;
}) {
    const content = (
        <div className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    );

    return href ? <Link href={href}>{content}</Link> : content;
}

export default function AdminDashboardIndex({
    occupancy,
    revenueThisMonth,
    outstandingInvoicesCount,
    openMaintenanceCount,
    revenueTrend,
}: Props) {
    const { t } = useTranslation();
    const availableRooms =
        occupancy.total_rooms - occupancy.short_stay - occupancy.long_stay;

    return (
        <>
            <Head title={t('adminDashboard.title')} />

            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold">
                    {t('adminDashboard.title')}
                </h1>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label={t('adminDashboard.stats.revenueThisMonth')}
                        value={`$${revenueThisMonth}`}
                    />
                    <StatCard
                        label={t('adminDashboard.stats.outstandingInvoices')}
                        value={outstandingInvoicesCount}
                        href={adminInvoicesIndex().url}
                    />
                    <StatCard
                        label={t(
                            'adminDashboard.stats.openMaintenanceRequests',
                        )}
                        value={openMaintenanceCount}
                        href={staffMaintenanceIndex().url}
                    />
                    <StatCard
                        label={t('adminDashboard.stats.totalRooms')}
                        value={occupancy.total_rooms}
                    />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <RevenueTrendChart data={revenueTrend} />
                    </div>
                    <OccupancyBreakdownChart
                        shortStay={occupancy.short_stay}
                        longStay={occupancy.long_stay}
                        available={availableRooms}
                    />
                </div>
            </div>
        </>
    );
}

AdminDashboardIndex.layout = {
    breadcrumbs: [{ title: 'Admin dashboard', href: adminDashboardIndex() }],
};
