import { Head } from '@inertiajs/react';
import MaintenanceRequestDialog from '@/components/maintenance-request-dialog';
import Pagination from '@/components/pagination';
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
import { index as maintenanceIndex } from '@/routes/maintenance';
import type {
    MaintenanceRequest,
    MaintenanceRoomSummary,
    Paginated,
} from '@/types';

type Props = {
    requests: Paginated<MaintenanceRequest>;
    rooms: MaintenanceRoomSummary[];
};

export default function MaintenanceIndex({ requests, rooms }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('maintenance.page.title')} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        {t('maintenance.page.title')}
                    </h1>
                    <MaintenanceRequestDialog rooms={rooms} />
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('common.labels.room')}</TableHead>
                                <TableHead>
                                    {t('maintenance.table.title')}
                                </TableHead>
                                <TableHead>
                                    {t('maintenance.table.priority')}
                                </TableHead>
                                <TableHead>
                                    {t('common.labels.status')}
                                </TableHead>
                                <TableHead>
                                    {t('maintenance.table.submitted')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center text-muted-foreground"
                                    >
                                        {t('maintenance.page.empty')}
                                    </TableCell>
                                </TableRow>
                            )}
                            {requests.data.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell>
                                        {request.room.room_number}
                                    </TableCell>
                                    <TableCell>{request.title}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {t(
                                                `common.maintenancePriority.${request.priority}`,
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {t(
                                                `common.maintenanceStatus.${request.status}`,
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{request.created_at}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Pagination meta={requests} />
            </div>
        </>
    );
}

MaintenanceIndex.layout = {
    breadcrumbs: [{ title: 'Maintenance', href: maintenanceIndex() }],
};
