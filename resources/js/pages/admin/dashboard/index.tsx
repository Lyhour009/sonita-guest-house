import { Head, Link } from '@inertiajs/react';
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
}: Props) {
    const availableRooms =
        occupancy.total_rooms - occupancy.short_stay - occupancy.long_stay;

    return (
        <>
            <Head title="Admin dashboard" />

            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold">Admin dashboard</h1>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Revenue this month"
                        value={`$${revenueThisMonth}`}
                    />
                    <StatCard
                        label="Outstanding invoices"
                        value={outstandingInvoicesCount}
                        href={adminInvoicesIndex().url}
                    />
                    <StatCard
                        label="Open maintenance requests"
                        value={openMaintenanceCount}
                        href={staffMaintenanceIndex().url}
                    />
                    <StatCard
                        label="Total rooms"
                        value={occupancy.total_rooms}
                    />
                </div>

                <div className="rounded-xl border p-4">
                    <h2 className="mb-3 font-medium">Occupancy</h2>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">
                                Short-stay occupied
                            </p>
                            <p className="text-lg font-semibold">
                                {occupancy.short_stay}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">
                                Long-stay occupied
                            </p>
                            <p className="text-lg font-semibold">
                                {occupancy.long_stay}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Available</p>
                            <p className="text-lg font-semibold">
                                {availableRooms}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminDashboardIndex.layout = {
    breadcrumbs: [{ title: 'Admin dashboard', href: adminDashboardIndex() }],
};
