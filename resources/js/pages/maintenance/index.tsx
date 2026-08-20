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
    return (
        <>
            <Head title="My maintenance requests" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        My maintenance requests
                    </h1>
                    <MaintenanceRequestDialog rooms={rooms} />
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submitted</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center text-muted-foreground"
                                    >
                                        You haven't reported any issues yet.
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
                                            {request.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {request.status}
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
