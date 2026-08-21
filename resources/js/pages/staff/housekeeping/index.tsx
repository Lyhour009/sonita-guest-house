import { Head, router } from '@inertiajs/react';
import HousekeepingController from '@/actions/App/Http/Controllers/Staff/HousekeepingController';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import { index as staffHousekeepingIndex } from '@/routes/staff/housekeeping';
import type { CleaningRoom } from '@/types';

type Props = {
    rooms: CleaningRoom[];
};

export default function StaffHousekeepingIndex({ rooms }: Props) {
    const { t } = useTranslation();

    const markClean = (roomId: string) => {
        router.patch(
            HousekeepingController.markClean.url(roomId),
            {},
            { preserveScroll: true, only: ['rooms'] },
        );
    };

    return (
        <>
            <Head title={t('staff.housekeeping.pageTitle')} />

            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold">
                    {t('staff.housekeeping.heading')}
                </h1>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('common.labels.room')}</TableHead>
                                <TableHead>{t('common.labels.type')}</TableHead>
                                <TableHead>
                                    {t('staff.housekeeping.table.floor')}
                                </TableHead>
                                <TableHead className="text-right">
                                    {t('common.actions.actions')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rooms.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center text-muted-foreground"
                                    >
                                        {t('staff.housekeeping.empty')}
                                    </TableCell>
                                </TableRow>
                            )}
                            {rooms.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell>{room.room_number}</TableCell>
                                    <TableCell>{room.room_type}</TableCell>
                                    <TableCell>{room.floor ?? '—'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            onClick={() => markClean(room.id)}
                                        >
                                            {t('staff.housekeeping.markClean')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

StaffHousekeepingIndex.layout = {
    breadcrumbs: [{ title: 'Room status', href: staffHousekeepingIndex() }],
};
