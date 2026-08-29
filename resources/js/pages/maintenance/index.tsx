import { Head } from '@inertiajs/react';
import { Wrench } from 'lucide-react';
import {
    MaintenancePriorityBadge,
    MaintenanceStatusBadge,
} from '@/components/maintenance-badges';
import MaintenanceRequestDialog from '@/components/maintenance-request-dialog';
import Pagination from '@/components/pagination';
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

            <div className="w-full space-y-5 bg-background p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            {t('maintenance.page.title')}
                        </h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {t('maintenance.page.subtitle')}
                        </p>
                    </div>
                    <MaintenanceRequestDialog rooms={rooms} />
                </div>

                {requests.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-border/50 bg-card/50 py-24 text-center shadow-sm backdrop-blur-sm">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-3xl bg-muted shadow-inner">
                            <Wrench className="size-8 text-muted-foreground opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                            {t('maintenance.page.empty')}
                        </h3>
                        <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">
                            {t('maintenance.page.emptyDescription')}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-md">
                        <Table>
                            <TableHeader className="border-b border-border bg-muted/50">
                                <TableRow className="h-13 border-border hover:bg-transparent">
                                    <TableHead className="h-13 py-4 pl-6 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.room')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('maintenance.table.title')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('maintenance.table.priority')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.status')}
                                    </TableHead>
                                    <TableHead className="h-13 py-4 pr-6 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('maintenance.table.submitted')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border/60">
                                {requests.data.map((request) => (
                                    <TableRow
                                        key={request.id}
                                        className="h-16 transition-all duration-300 hover:bg-primary/5"
                                    >
                                        <TableCell className="py-3.5 pl-6">
                                            <span className="flex h-8 min-w-10 items-center justify-center rounded-xl border border-border/90 bg-background px-2.5 text-[13px] font-bold text-foreground shadow-2xs">
                                                #{request.room.room_number}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5 text-sm font-semibold text-foreground">
                                            {request.title}
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5">
                                            <MaintenancePriorityBadge
                                                priority={request.priority}
                                            />
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5">
                                            <MaintenanceStatusBadge
                                                status={request.status}
                                            />
                                        </TableCell>
                                        <TableCell className="py-3.5 pr-6 text-sm text-muted-foreground">
                                            {request.created_at}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <Pagination meta={requests} />
            </div>
        </>
    );
}

MaintenanceIndex.layout = {
    breadcrumbs: [{ title: 'Maintenance', href: maintenanceIndex() }],
};
