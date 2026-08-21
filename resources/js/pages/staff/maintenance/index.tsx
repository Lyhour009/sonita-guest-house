import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MaintenanceController from '@/actions/App/Http/Controllers/Staff/MaintenanceRequestController';
import MaintenanceRequestDialog from '@/components/maintenance-request-dialog';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTranslation } from '@/hooks/use-translation';
import { index as staffMaintenanceIndex } from '@/routes/staff/maintenance';
import type {
    HousekeepingStaffOption,
    MaintenanceRoomSummary,
    Paginated,
    StaffMaintenanceRequest,
} from '@/types';

type Filters = {
    search: string | null;
    status: string | null;
    priority: string | null;
};

type Props = {
    requests: Paginated<StaffMaintenanceRequest>;
    filters: Filters;
    isAdmin: boolean;
    housekeepingStaff: HousekeepingStaffOption[];
    rooms: MaintenanceRoomSummary[];
};

const closedStatuses = ['resolved', 'cancelled'];

export default function StaffMaintenanceIndex({
    requests,
    filters,
    isAdmin,
    housekeepingStaff,
    rooms,
}: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'any');
    const [priority, setPriority] = useState(filters.priority ?? 'any');

    const applyFilters = (next: Partial<Filters>) => {
        const nextSearch = next.search ?? search;
        const nextStatus = next.status ?? status;
        const nextPriority = next.priority ?? priority;

        router.get(
            staffMaintenanceIndex().url,
            {
                search: nextSearch || undefined,
                status: nextStatus === 'any' ? undefined : nextStatus,
                priority: nextPriority === 'any' ? undefined : nextPriority,
            },
            {
                preserveState: true,
                replace: true,
                only: ['requests', 'filters'],
            },
        );
    };

    const debouncedSearch = useDebouncedValue(search, 300);

    useEffect(() => {
        applyFilters({ search: debouncedSearch });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const assign = (requestId: string, assignedTo: string) => {
        router.patch(
            MaintenanceController.assign.url(requestId),
            { assigned_to: assignedTo },
            { preserveScroll: true, only: ['requests'] },
        );
    };

    const updateStatus = (requestId: string, newStatus: string) => {
        router.patch(
            MaintenanceController.updateStatus.url(requestId),
            { status: newStatus },
            { preserveScroll: true, only: ['requests'] },
        );
    };

    return (
        <>
            <Head title={t('staff.maintenance.pageTitle')} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        {t('staff.maintenance.pageTitle')}
                    </h1>
                    <MaintenanceRequestDialog rooms={rooms} />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        placeholder={t('staff.maintenance.searchPlaceholder')}
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="max-w-xs"
                    />

                    <Select
                        value={status}
                        onValueChange={(value) => {
                            setStatus(value);
                            applyFilters({ status: value });
                        }}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue
                                placeholder={t('common.labels.status')}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">
                                {t('staff.maintenance.anyStatus')}
                            </SelectItem>
                            <SelectItem value="pending">
                                {t('common.maintenanceStatus.pending')}
                            </SelectItem>
                            <SelectItem value="in_progress">
                                {t('common.maintenanceStatus.in_progress')}
                            </SelectItem>
                            <SelectItem value="resolved">
                                {t('common.maintenanceStatus.resolved')}
                            </SelectItem>
                            <SelectItem value="cancelled">
                                {t('common.maintenanceStatus.cancelled')}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={priority}
                        onValueChange={(value) => {
                            setPriority(value);
                            applyFilters({ priority: value });
                        }}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue
                                placeholder={t(
                                    'staff.maintenance.priorityPlaceholder',
                                )}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">
                                {t('staff.maintenance.anyPriority')}
                            </SelectItem>
                            <SelectItem value="low">
                                {t('common.maintenancePriority.low')}
                            </SelectItem>
                            <SelectItem value="medium">
                                {t('common.maintenancePriority.medium')}
                            </SelectItem>
                            <SelectItem value="high">
                                {t('common.maintenancePriority.high')}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('common.labels.room')}</TableHead>
                                <TableHead>
                                    {t('staff.maintenance.table.title')}
                                </TableHead>
                                <TableHead>
                                    {t('staff.maintenance.table.reporter')}
                                </TableHead>
                                <TableHead>
                                    {t('staff.maintenance.priorityPlaceholder')}
                                </TableHead>
                                <TableHead>
                                    {t('common.labels.status')}
                                </TableHead>
                                <TableHead>
                                    {t('staff.maintenance.table.assignee')}
                                </TableHead>
                                <TableHead className="text-right">
                                    {t('common.actions.actions')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground"
                                    >
                                        {t('staff.maintenance.empty')}
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
                                        {request.reporter.full_name}
                                    </TableCell>
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
                                    <TableCell>
                                        {isAdmin &&
                                        !closedStatuses.includes(
                                            request.status,
                                        ) ? (
                                            <Select
                                                value={
                                                    request.assignee?.id ??
                                                    'unassigned'
                                                }
                                                onValueChange={(value) =>
                                                    assign(request.id, value)
                                                }
                                            >
                                                <SelectTrigger className="w-40">
                                                    <SelectValue
                                                        placeholder={t(
                                                            'staff.maintenance.assignPlaceholder',
                                                        )}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value="unassigned"
                                                        disabled
                                                    >
                                                        {t(
                                                            'staff.maintenance.unassigned',
                                                        )}
                                                    </SelectItem>
                                                    {housekeepingStaff.map(
                                                        (staff) => (
                                                            <SelectItem
                                                                key={staff.id}
                                                                value={staff.id}
                                                            >
                                                                {
                                                                    staff.full_name
                                                                }
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            (request.assignee?.full_name ?? '—')
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {!closedStatuses.includes(
                                            request.status,
                                        ) && (
                                            <div className="flex justify-end gap-2">
                                                {request.status ===
                                                    'pending' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            updateStatus(
                                                                request.id,
                                                                'in_progress',
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            'staff.maintenance.start',
                                                        )}
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        updateStatus(
                                                            request.id,
                                                            'resolved',
                                                        )
                                                    }
                                                >
                                                    {t(
                                                        'staff.maintenance.resolve',
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        updateStatus(
                                                            request.id,
                                                            'cancelled',
                                                        )
                                                    }
                                                >
                                                    {t('common.actions.cancel')}
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
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

StaffMaintenanceIndex.layout = {
    breadcrumbs: [{ title: 'Maintenance', href: staffMaintenanceIndex() }],
};
