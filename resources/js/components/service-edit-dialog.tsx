import { Form } from '@inertiajs/react';
import ServiceController from '@/actions/App/Http/Controllers/Admin/ServiceController';
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
import type { Service } from '@/types';

type Props = {
    service: Service | null;
    onOpenChange: (open: boolean) => void;
};

export default function ServiceEditDialog({ service, onOpenChange }: Props) {
    return (
        <Dialog open={service !== null} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit {service?.name}</DialogTitle>
                </DialogHeader>

                {service && (
                    <Form
                        {...ServiceController.update.form(service.id)}
                        onSuccess={() => onOpenChange(false)}
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={service.name}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        defaultValue={service.price}
                                        required
                                    />
                                    <InputError message={errors.price} />
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
