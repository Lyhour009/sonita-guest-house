import { Head, router } from '@inertiajs/react';
import { BedDouble, CheckCircle2, StickyNote, Wrench } from 'lucide-react';
import HousekeepingController from '@/actions/App/Http/Controllers/Staff/HousekeepingController';
import MaintenanceRequestDialog from '@/components/maintenance-request-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePendingAction } from '@/hooks/use-pending-action';
import { useTranslation } from '@/hooks/use-translation';
import { index as staffHousekeepingIndex } from '@/routes/staff/housekeeping';
import type { CleaningRoom } from '@/types';

type Props = {
    rooms: CleaningRoom[];
};

export default function StaffHousekeepingIndex({ rooms }: Props) {
    const { t } = useTranslation();
    const { isPending, withPending } = usePendingAction();

    const markClean = (roomId: string) => {
        router.patch(
            HousekeepingController.markClean.url(roomId),
            {},
            withPending(`clean-${roomId}`, {
                preserveScroll: true,
                only: ['rooms'],
            }),
        );
    };

    return (
        <>
            <Head title={t('staff.housekeeping.pageTitle')} />

            <div className="w-full space-y-5 bg-background p-4 md:p-6">
                <div className="space-y-4">
                    <div className="pt-1">
                        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            {t('staff.housekeeping.pageTitle')}
                        </h1>
                        <p className="mt-0.5 font-sans text-sm text-muted-foreground">
                            {t('staff.housekeeping.subtitle')}
                        </p>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:w-fit sm:min-w-64">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-warning/10 text-amber-600 dark:text-amber-400">
                            <BedDouble className="size-4.5" />
                        </div>
                        <div>
                            <p className="font-sans text-2xl font-bold tracking-tight text-foreground">
                                {rooms.length}
                            </p>
                            <p className="font-sans text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                {t('staff.housekeeping.heading')}
                            </p>
                        </div>
                    </div>
                </div>

                {rooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-border/50 bg-card/50 py-24 text-center shadow-sm backdrop-blur-sm">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-3xl bg-muted shadow-inner">
                            <CheckCircle2 className="size-8 text-muted-foreground opacity-50" />
                        </div>
                        <h3 className="font-sans text-xl font-bold text-foreground">
                            {t('staff.housekeeping.empty')}
                        </h3>
                        <p className="mt-1 max-w-sm text-center font-sans text-sm text-muted-foreground">
                            {t('staff.housekeeping.emptyDescription')}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-md">
                        <Table>
                            <TableHeader className="border-b border-border bg-muted/50">
                                <TableRow className="h-13 border-border hover:bg-transparent">
                                    <TableHead className="h-13 py-4 pl-6 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.room')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.labels.type')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('staff.housekeeping.table.floor')}
                                    </TableHead>
                                    <TableHead className="h-13 py-4 pr-6 text-right font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.actions.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border/60">
                                {rooms.map((room) => (
                                    <TableRow
                                        key={room.id}
                                        className="h-16 transition-all duration-300 hover:bg-primary/5"
                                    >
                                        <TableCell className="py-3.5 pl-6">
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex h-8 min-w-10 items-center justify-center rounded-xl border border-border/90 bg-background px-2.5 font-sans text-[13px] font-bold text-foreground shadow-2xs">
                                                    #{room.room_number}
                                                </span>
                                                {room.notes && (
                                                    <span
                                                        title={t(
                                                            'staff.housekeeping.table.hasNotes',
                                                        )}
                                                    >
                                                        <StickyNote className="size-3.5 shrink-0 text-amber-500" />
                                                    </span>
                                                )}
                                            </div>
                                            {room.notes && (
                                                <p className="mt-1.5 max-w-xs truncate font-sans text-xs text-muted-foreground">
                                                    {room.notes}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5 font-sans text-sm text-foreground">
                                            {room.room_type}
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5 font-sans text-sm text-muted-foreground">
                                            {room.floor ?? '—'}
                                        </TableCell>
                                        <TableCell className="py-3.5 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <MaintenanceRequestDialog
                                                    rooms={[room]}
                                                    trigger={
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="size-8 rounded-full p-0 font-sans text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            title={t(
                                                                'maintenance.requestDialog.trigger',
                                                            )}
                                                        >
                                                            <Wrench className="size-4" />
                                                        </Button>
                                                    }
                                                />
                                                <Button
                                                    size="sm"
                                                    className="h-8 gap-1.5 rounded-full bg-primary font-sans text-xs font-semibold text-primary-foreground shadow-2xs transition-transform hover:scale-105"
                                                    disabled={isPending(
                                                        `clean-${room.id}`,
                                                    )}
                                                    onClick={() =>
                                                        markClean(room.id)
                                                    }
                                                >
                                                    {isPending(
                                                        `clean-${room.id}`,
                                                    ) ? (
                                                        <Spinner className="size-3.5" />
                                                    ) : (
                                                        <CheckCircle2 className="size-3.5" />
                                                    )}
                                                    {t(
                                                        'staff.housekeeping.markClean',
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </>
    );
}

StaffHousekeepingIndex.layout = {
    breadcrumbs: [{ title: 'Room status', href: staffHousekeepingIndex() }],
};
