import { Form } from '@inertiajs/react';
import StaffAccountController from '@/actions/App/Http/Controllers/Admin/StaffAccountController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { StaffAccount } from '@/types';

type Props = {
    staff: StaffAccount | null;
    onOpenChange: (open: boolean) => void;
};

export default function StaffEditDialog({ staff, onOpenChange }: Props) {
    return (
        <Dialog open={staff !== null} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit {staff?.full_name}</DialogTitle>
                </DialogHeader>

                {staff && (
                    <Form
                        {...StaffAccountController.update.form(staff.id)}
                        onSuccess={() => onOpenChange(false)}
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="full_name">Full name</Label>
                                    <Input
                                        id="full_name"
                                        name="full_name"
                                        defaultValue={staff.full_name}
                                        required
                                    />
                                    <InputError message={errors.full_name} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={staff.email}
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="phone_number">
                                        Phone number (optional)
                                    </Label>
                                    <Input
                                        id="phone_number"
                                        name="phone_number"
                                        defaultValue={staff.phone_number ?? ''}
                                    />
                                    <InputError message={errors.phone_number} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        name="role"
                                        defaultValue={staff.role}
                                    >
                                        <SelectTrigger
                                            id="role"
                                            className="w-full"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="receptionist">
                                                Receptionist
                                            </SelectItem>
                                            <SelectItem value="housekeeping">
                                                Housekeeping
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.role} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="password">
                                        New password (optional)
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Leave blank to keep current password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="password_confirmation">
                                        Confirm new password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                    />
                                </div>

                                <DialogFooter>
                                    <Button type="submit" disabled={processing}>
                                        Save changes
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
