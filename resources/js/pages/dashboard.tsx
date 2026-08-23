import { Head, Link, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import { resolveNotificationMessage } from '@/lib/notification-message';
import { dashboard } from '@/routes';
import { index as invoicesIndex } from '@/routes/invoices';
import { index as notificationsIndex } from '@/routes/notifications';
import { index as staffHousekeepingIndex } from '@/routes/staff/housekeeping';
import { index as staffMaintenanceIndex } from '@/routes/staff/maintenance';
import type {
    GuestDashboardData,
    HousekeepingDashboardData,
    ReceptionistDashboardData,
} from '@/types';

type Props = Partial<
    GuestDashboardData & ReceptionistDashboardData & HousekeepingDashboardData
>;

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

function GuestDashboard({
    reservations = [],
    latestInvoice,
    notifications = [],
}: Partial<GuestDashboardData>) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-xl font-semibold">
                {t('dashboard.guest.title')}
            </h1>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                    <h2 className="mb-3 font-medium">
                        {t('dashboard.guest.currentReservations')}
                    </h2>
                    {reservations.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            {t('dashboard.guest.noActiveReservations')}
                        </p>
                    )}
                    <div className="space-y-2">
                        {reservations.map((reservation) => (
                            <div
                                key={reservation.id}
                                className="flex items-center justify-between text-sm"
                            >
                                <span>
                                    {t('common.labels.room')}{' '}
                                    {reservation.room.room_number} ·{' '}
                                    {t(
                                        `common.reservationType.${reservation.reservation_type}`,
                                    )}
                                </span>
                                <Badge variant="outline">
                                    {t(
                                        `common.reservationStatus.${reservation.status}`,
                                    )}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border p-4">
                    <h2 className="mb-3 font-medium">
                        {t('dashboard.guest.latestInvoice')}
                    </h2>
                    {latestInvoice ? (
                        <Link
                            href={invoicesIndex()}
                            className="block space-y-1 text-sm underline"
                        >
                            <span>
                                {t('common.labels.room')}{' '}
                                {latestInvoice.room.room_number}
                            </span>
                            <span className="block">
                                ${latestInvoice.total_amount} ·{' '}
                                {t(
                                    `common.invoiceStatus.${latestInvoice.status}`,
                                )}
                            </span>
                        </Link>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {t('dashboard.guest.noInvoices')}
                        </p>
                    )}
                </div>
            </div>

            <div className="rounded-xl border p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-medium">
                        {t('dashboard.guest.recentNotifications')}
                    </h2>
                    <Link
                        href={notificationsIndex()}
                        className="text-sm underline"
                    >
                        {t('common.actions.viewAll')}
                    </Link>
                </div>
                {notifications.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        {t('dashboard.guest.noNotifications')}
                    </p>
                )}
                <div className="space-y-2">
                    {notifications.map((notification) => (
                        <p key={notification.id} className="text-sm">
                            {resolveNotificationMessage(t, notification)}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ReceptionistDashboard({
    arrivals = [],
    departures = [],
    rooms = [],
}: Partial<ReceptionistDashboardData>) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-xl font-semibold">
                {t('dashboard.receptionist.title')}
            </h1>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                    <h2 className="mb-3 font-medium">
                        {t('dashboard.receptionist.todaysArrivals', {
                            count: arrivals.length,
                        })}
                    </h2>
                    {arrivals.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            {t('dashboard.receptionist.noArrivals')}
                        </p>
                    )}
                    <div className="space-y-2">
                        {arrivals.map((entry) => (
                            <div
                                key={entry.id}
                                className="flex items-center justify-between text-sm"
                            >
                                <span>{entry.guest.full_name}</span>
                                <span className="text-muted-foreground">
                                    {t('common.labels.room')}{' '}
                                    {entry.room.room_number}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border p-4">
                    <h2 className="mb-3 font-medium">
                        {t('dashboard.receptionist.todaysDepartures', {
                            count: departures.length,
                        })}
                    </h2>
                    {departures.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            {t('dashboard.receptionist.noDepartures')}
                        </p>
                    )}
                    <div className="space-y-2">
                        {departures.map((entry) => (
                            <div
                                key={entry.id}
                                className="flex items-center justify-between text-sm"
                            >
                                <span>{entry.guest.full_name}</span>
                                <span className="text-muted-foreground">
                                    {t('common.labels.room')}{' '}
                                    {entry.room.room_number}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="rounded-xl border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('common.labels.room')}</TableHead>
                            <TableHead>{t('common.labels.status')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rooms.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className="text-center text-muted-foreground"
                                >
                                    {t('dashboard.receptionist.noRooms')}
                                </TableCell>
                            </TableRow>
                        )}
                        {rooms.map((room) => (
                            <TableRow key={room.id}>
                                <TableCell>{room.room_number}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {t(`common.roomStatus.${room.status}`)}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function HousekeepingDashboard({
    roomsAwaitingCleaning = 0,
    openAssignedMaintenance = 0,
}: Partial<HousekeepingDashboardData>) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-xl font-semibold">
                {t('dashboard.housekeeping.title')}
            </h1>

            <div className="grid gap-4 md:grid-cols-2">
                <StatCard
                    label={t('dashboard.housekeeping.roomsAwaitingCleaning')}
                    value={roomsAwaitingCleaning}
                    href={staffHousekeepingIndex().url}
                />
                <StatCard
                    label={t('dashboard.housekeeping.openAssignedMaintenance')}
                    value={openAssignedMaintenance}
                    href={staffMaintenanceIndex().url}
                />
            </div>
        </div>
    );
}

export default function Dashboard(props: Props) {
    const { auth } = usePage().props;
    const { t } = useTranslation();
    const role = auth.user?.role;

    return (
        <>
            <Head title={t('nav.dashboard')} />
            {(role === 'receptionist' || role === 'admin') && (
                <ReceptionistDashboard
                    arrivals={props.arrivals}
                    departures={props.departures}
                    rooms={props.rooms}
                />
            )}
            {role === 'housekeeping' && (
                <HousekeepingDashboard
                    roomsAwaitingCleaning={props.roomsAwaitingCleaning}
                    openAssignedMaintenance={props.openAssignedMaintenance}
                />
            )}
            {role === 'guest' && (
                <GuestDashboard
                    reservations={props.reservations}
                    latestInvoice={props.latestInvoice ?? null}
                    notifications={props.notifications}
                />
            )}
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
