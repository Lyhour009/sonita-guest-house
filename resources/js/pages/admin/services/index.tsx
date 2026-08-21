import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Pagination from '@/components/pagination';
import ServiceCreateDialog from '@/components/service-create-dialog';
import ServiceEditDialog from '@/components/service-edit-dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { destroy, index as adminServicesIndex } from '@/routes/admin/services';
import type { Paginated, Service } from '@/types';

type Props = {
    services: Paginated<Service>;
};

export default function AdminServicesIndex({ services }: Props) {
    const { t } = useTranslation();
    const [editingServiceId, setEditingServiceId] = useState<string | null>(
        null,
    );

    const editingService = useMemo(
        () =>
            services.data.find((service) => service.id === editingServiceId) ??
            null,
        [services.data, editingServiceId],
    );

    const { isPending, withPending } = usePendingAction();

    const deleteService = (serviceId: string) => {
        router.delete(
            destroy(serviceId).url,
            withPending(`delete-${serviceId}`, { preserveScroll: true }),
        );
    };

    return (
        <>
            <Head title={t('services.title')} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        {t('services.title')}
                    </h1>
                    <ServiceCreateDialog />
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    {t('services.table.name')}
                                </TableHead>
                                <TableHead>
                                    {t('services.table.price')}
                                </TableHead>
                                <TableHead className="text-right">
                                    {t('common.actions.actions')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="text-center text-muted-foreground"
                                    >
                                        {t('services.empty')}
                                    </TableCell>
                                </TableRow>
                            )}
                            {services.data.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell>{service.name}</TableCell>
                                    <TableCell>${service.price}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setEditingServiceId(
                                                        service.id,
                                                    )
                                                }
                                            >
                                                {t('common.actions.edit')}
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        {t(
                                                            'common.actions.delete',
                                                        )}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            {t(
                                                                'services.deleteService.title',
                                                                {
                                                                    name: service.name,
                                                                },
                                                            )}
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            {t(
                                                                'services.deleteService.description',
                                                            )}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            {t(
                                                                'common.actions.cancel',
                                                            )}
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            variant="destructive"
                                                            disabled={isPending(
                                                                `delete-${service.id}`,
                                                            )}
                                                            onClick={() =>
                                                                deleteService(
                                                                    service.id,
                                                                )
                                                            }
                                                        >
                                                            {isPending(
                                                                `delete-${service.id}`,
                                                            ) && (
                                                                <Spinner className="mr-2" />
                                                            )}
                                                            {t(
                                                                'common.actions.delete',
                                                            )}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Pagination meta={services} />
            </div>

            <ServiceEditDialog
                service={editingService}
                onOpenChange={(open) => !open && setEditingServiceId(null)}
            />
        </>
    );
}

AdminServicesIndex.layout = {
    breadcrumbs: [{ title: 'Services', href: adminServicesIndex() }],
};
