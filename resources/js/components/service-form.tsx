import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import type { Service } from '@/types';

type ServiceFormProps = {
    service?: Service;
    errors: Partial<Record<string, string>>;
};

export default function ServiceForm({ service, errors }: ServiceFormProps) {
    const { t } = useTranslation();

    return (
        <>
            <div className="grid gap-1.5">
                <Label htmlFor="name">{t('services.form.name')}</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={service?.name}
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="price">{t('services.form.price')}</Label>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={service?.price}
                    required
                />
                <InputError message={errors.price} />
            </div>
        </>
    );
}
