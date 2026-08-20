import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import Pagination from '@/components/pagination';
import StaffCreateDialog from '@/components/staff-create-dialog';
import StaffEditDialog from '@/components/staff-edit-dialog';
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
import { index as adminStaffIndex } from '@/routes/admin/staff';
import type { Paginated, StaffAccount } from '@/types';

type Filters = {
    search: string | null;
    role: string | null;
};

type Props = {
    staff: Paginated<StaffAccount>;
    filters: Filters;
};

export default function AdminStaffIndex({ staff, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState(filters.role ?? 'any');
    const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

    const editingStaff = useMemo(
        () => staff.data.find((member) => member.id === editingStaffId) ?? null,
        [staff.data, editingStaffId],
    );

    const applyFilters = (next: Partial<Filters>) => {
        const nextSearch = next.search ?? search;
        const nextRole = next.role ?? role;

        router.get(
            adminStaffIndex().url,
            {
                search: nextSearch || undefined,
                role: nextRole === 'any' ? undefined : nextRole,
            },
            { preserveState: true, replace: true, only: ['staff', 'filters'] },
        );
    };

    useEffect(() => {
        const timeout = setTimeout(() => applyFilters({ search }), 300);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <>
            <Head title="Staff" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Staff</h1>
                    <StaffCreateDialog />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="max-w-xs"
                    />

                    <Select
                        value={role}
                        onValueChange={(value) => {
                            setRole(value);
                            applyFilters({ role: value });
                        }}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any role</SelectItem>
                            <SelectItem value="receptionist">
                                Receptionist
                            </SelectItem>
                            <SelectItem value="housekeeping">
                                Housekeeping
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staff.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center text-muted-foreground"
                                    >
                                        No staff accounts match your filters.
                                    </TableCell>
                                </TableRow>
                            )}
                            {staff.data.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>{member.full_name}</TableCell>
                                    <TableCell>{member.email}</TableCell>
                                    <TableCell>
                                        {member.phone_number ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {member.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setEditingStaffId(member.id)
                                            }
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Pagination meta={staff} />
            </div>

            <StaffEditDialog
                staff={editingStaff}
                onOpenChange={(open) => !open && setEditingStaffId(null)}
            />
        </>
    );
}

AdminStaffIndex.layout = {
    breadcrumbs: [{ title: 'Staff', href: adminStaffIndex() }],
};
