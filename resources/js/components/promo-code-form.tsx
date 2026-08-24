import { useState } from 'react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/hooks/use-translation';
import type { PromoCode } from '@/types';

type PromoCodeFormProps = {
    promoCode?: PromoCode;
    errors: Partial<Record<string, string>>;
};

export default function PromoCodeForm({
    promoCode,
    errors,
}: PromoCodeFormProps) {
    const { t } = useTranslation();
    const [discountType, setDiscountType] = useState(
        promoCode?.discount_type ?? 'percent',
    );
    const [active, setActive] = useState(promoCode?.active ?? true);

    return (
        <>
            <div className="grid gap-1.5">
                <Label htmlFor="code">{t('adminPromoCodes.form.code')}</Label>
                <Input
                    id="code"
                    name="code"
                    defaultValue={promoCode?.code}
                    className="uppercase"
                    required
                />
                <InputError message={errors.code} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="discount_type">
                        {t('adminPromoCodes.form.discountType')}
                    </Label>
                    <Select
                        name="discount_type"
                        value={discountType}
                        onValueChange={(value) =>
                            setDiscountType(value as 'percent' | 'fixed')
                        }
                    >
                        <SelectTrigger id="discount_type" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="percent">
                                {t('adminPromoCodes.form.percent')}
                            </SelectItem>
                            <SelectItem value="fixed">
                                {t('adminPromoCodes.form.fixed')}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.discount_type} />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="discount_value">
                        {discountType === 'percent'
                            ? t('adminPromoCodes.form.discountValuePercent')
                            : t('adminPromoCodes.form.discountValueFixed')}
                    </Label>
                    <Input
                        id="discount_value"
                        name="discount_value"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={promoCode?.discount_value}
                        required
                    />
                    <InputError message={errors.discount_value} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="expires_at">
                        {t('adminPromoCodes.form.expiresAt')}
                    </Label>
                    <Input
                        id="expires_at"
                        name="expires_at"
                        type="date"
                        defaultValue={promoCode?.expires_at ?? ''}
                    />
                    <InputError message={errors.expires_at} />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="max_uses">
                        {t('adminPromoCodes.form.maxUses')}
                    </Label>
                    <Input
                        id="max_uses"
                        name="max_uses"
                        type="number"
                        min="1"
                        defaultValue={promoCode?.max_uses ?? ''}
                        placeholder={t('adminPromoCodes.form.unlimited')}
                    />
                    <InputError message={errors.max_uses} />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input type="hidden" name="active" value="0" />
                <Switch
                    id="active"
                    name="active"
                    value="1"
                    checked={active}
                    onCheckedChange={setActive}
                />
                <Label htmlFor="active" className="cursor-pointer text-sm">
                    {t('adminPromoCodes.form.active')}
                </Label>
                <InputError message={errors.active} />
            </div>
        </>
    );
}
