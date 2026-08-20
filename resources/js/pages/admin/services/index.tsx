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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { destroy, index as adminServicesIndex } from '@/routes/admin/services';
import type { Paginated, Service } from '@/types';

type Props = {
    services: Paginated<Service>;
};

export default function AdminServicesIndex({ services }: Props) {
    const [editingServiceId, setEditingServiceId] = useState<string | null>(
        null,
    );

    const editingService = useMemo(
        () =>
            services.data.find((service) => service.id === editingServiceId) ??
            null,
        [services.data, editingServiceId],
    );

    const deleteService = (serviceId: string) => {
        router.delete(destroy(serviceId).url, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Services" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Services</h1>
                    <ServiceCreateDialog />
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">
                                    Actions
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
                                        No services yet.
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
                                                Edit
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Delete{' '}
                                                            {service.name}?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This cannot be
                                                            undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            variant="destructive"
                                                            onClick={() =>
                                                                deleteService(
                                                                    service.id,
                                                                )
                                                            }
                                                        >
                                                            Delete
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
