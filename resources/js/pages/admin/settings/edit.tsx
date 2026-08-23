import { Form, Head } from '@inertiajs/react';
import {
    Calculator,
    Clock,
    DollarSign,
    ImageOff,
    QrCode,
    Save,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import SettingController from '@/actions/App/Http/Controllers/Admin/SettingController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { edit as settingsEdit } from '@/routes/admin/settings';
import type { AppSettings } from '@/types';

type Props = {
    setting: AppSettings;
};

const SAMPLE_ROOM_RATE = 50;
const SAMPLE_ELECTRIC_UNITS = 10;
const SAMPLE_WATER_UNITS = 10;

export default function AdminSettingsEdit({ setting }: Props) {
    const { t } = useTranslation();

    const [taxRate, setTaxRate] = useState(String(setting.tax_rate));
    const [electricRate, setElectricRate] = useState(
        String(setting.electric_rate),
    );
    const [waterRate, setWaterRate] = useState(String(setting.water_rate));
    const [lateFee, setLateFee] = useState(String(setting.late_fee));
    const [paymentQrUrl, setPaymentQrUrl] = useState(
        setting.payment_qr_url ?? '',
    );
    const [qrPreviewError, setQrPreviewError] = useState(false);

    const preview = useMemo(() => {
        const tax = Number(taxRate) || 0;
        const electric = Number(electricRate) || 0;
        const water = Number(waterRate) || 0;
        const late = Number(lateFee) || 0;
        const taxAmount = (SAMPLE_ROOM_RATE * tax) / 100;

        return {
            taxAmount,
            total: SAMPLE_ROOM_RATE + taxAmount,
            electricAmount: electric * SAMPLE_ELECTRIC_UNITS,
            waterAmount: water * SAMPLE_WATER_UNITS,
            lateFee: late,
        };
    }, [taxRate, electricRate, waterRate, lateFee]);

    return (
        <>
            <Head title={t('settingsPage.title')} />

            <div className="space-y-8 p-6 lg:p-10">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-sans text-3xl font-bold tracking-tight">
                            {t('settingsPage.title')}
                        </h1>
                        <p className="mt-1 font-sans text-sm text-muted-foreground">
                            {t('settingsPage.description')}
                        </p>
                    </div>
                </div>

                <Form
                    {...SettingController.update.form()}
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing, errors, isDirty }) => (
                        <>
                            <div className="grid gap-6 lg:grid-cols-2">
                                <div className="space-y-4 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                                    <h2 className="flex items-center gap-2 font-sans text-sm font-bold text-foreground">
                                        <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <DollarSign className="size-4" />
                                        </span>
                                        {t('settingsPage.sections.general')}
                                    </h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="currency">
                                                {t(
                                                    'settingsPage.fields.currency',
                                                )}
                                            </Label>
                                            <Input
                                                id="currency"
                                                name="currency"
                                                maxLength={3}
                                                defaultValue={setting.currency}
                                                required
                                            />
                                            <InputError
                                                message={errors.currency}
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="tax_rate">
                                                {t(
                                                    'settingsPage.fields.taxRate',
                                                )}
                                            </Label>
                                            <Input
                                                id="tax_rate"
                                                name="tax_rate"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={taxRate}
                                                onChange={(e) =>
                                                    setTaxRate(e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.tax_rate}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                                    <h2 className="flex items-center gap-2 font-sans text-sm font-bold text-foreground">
                                        <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Clock className="size-4" />
                                        </span>
                                        {t('settingsPage.sections.stayTimes')}
                                    </h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="default_checkin_time">
                                                {t(
                                                    'settingsPage.fields.defaultCheckinTime',
                                                )}
                                            </Label>
                                            <Input
                                                id="default_checkin_time"
                                                name="default_checkin_time"
                                                type="time"
                                                defaultValue={
                                                    setting.default_checkin_time
                                                }
                                                required
                                            />
                                            <InputError
                                                message={
                                                    errors.default_checkin_time
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="default_checkout_time">
                                                {t(
                                                    'settingsPage.fields.defaultCheckoutTime',
                                                )}
                                            </Label>
                                            <Input
                                                id="default_checkout_time"
                                                name="default_checkout_time"
                                                type="time"
                                                defaultValue={
                                                    setting.default_checkout_time
                                                }
                                                required
                                            />
                                            <InputError
                                                message={
                                                    errors.default_checkout_time
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                                    <h2 className="flex items-center gap-2 font-sans text-sm font-bold text-foreground">
                                        <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Zap className="size-4" />
                                        </span>
                                        {t('settingsPage.sections.rates')}
                                    </h2>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="electric_rate">
                                                {t(
                                                    'settingsPage.fields.electricRate',
                                                )}
                                            </Label>
                                            <Input
                                                id="electric_rate"
                                                name="electric_rate"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={electricRate}
                                                onChange={(e) =>
                                                    setElectricRate(
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.electric_rate}
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="water_rate">
                                                {t(
                                                    'settingsPage.fields.waterRate',
                                                )}
                                            </Label>
                                            <Input
                                                id="water_rate"
                                                name="water_rate"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={waterRate}
                                                onChange={(e) =>
                                                    setWaterRate(e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.water_rate}
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="late_fee">
                                                {t(
                                                    'settingsPage.fields.lateFee',
                                                )}
                                            </Label>
                                            <Input
                                                id="late_fee"
                                                name="late_fee"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={lateFee}
                                                onChange={(e) =>
                                                    setLateFee(e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.late_fee}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                                    <h2 className="flex items-center gap-2 font-sans text-sm font-bold text-foreground">
                                        <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <QrCode className="size-4" />
                                        </span>
                                        {t('settingsPage.sections.payment')}
                                    </h2>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="payment_qr_url">
                                            {t(
                                                'settingsPage.fields.paymentQrUrl',
                                            )}
                                        </Label>
                                        <Input
                                            id="payment_qr_url"
                                            name="payment_qr_url"
                                            type="url"
                                            value={paymentQrUrl}
                                            onChange={(e) => {
                                                setPaymentQrUrl(e.target.value);
                                                setQrPreviewError(false);
                                            }}
                                        />
                                        <InputError
                                            message={errors.payment_qr_url}
                                        />

                                        {paymentQrUrl && (
                                            <div className="mt-1 flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
                                                {qrPreviewError ? (
                                                    <div className="flex items-center gap-2 text-xs font-medium text-red-700 dark:text-red-300">
                                                        <ImageOff className="size-8 shrink-0" />
                                                        <span>
                                                            {t(
                                                                'settingsPage.payment.previewError',
                                                            )}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <img
                                                            src={paymentQrUrl}
                                                            alt={t(
                                                                'settingsPage.payment.previewAlt',
                                                            )}
                                                            onError={() =>
                                                                setQrPreviewError(
                                                                    true,
                                                                )
                                                            }
                                                            className="size-16 shrink-0 rounded-lg border border-border/60 bg-white object-contain p-1"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            {t(
                                                                'settingsPage.payment.previewHint',
                                                            )}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="payment_instruction">
                                            {t(
                                                'settingsPage.fields.paymentInstruction',
                                            )}
                                        </Label>
                                        <Textarea
                                            id="payment_instruction"
                                            name="payment_instruction"
                                            defaultValue={
                                                setting.payment_instruction ??
                                                ''
                                            }
                                        />
                                        <InputError
                                            message={errors.payment_instruction}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Live example calculation */}
                            <div className="space-y-4 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                                <div>
                                    <h2 className="flex items-center gap-2 font-sans text-sm font-bold text-foreground">
                                        <span className="flex size-8 items-center justify-center rounded-xl bg-info/10 text-blue-600 dark:text-blue-400">
                                            <Calculator className="size-4" />
                                        </span>
                                        {t('settingsPage.sections.preview')}
                                    </h2>
                                    <p className="mt-1 pl-10 font-sans text-xs text-muted-foreground">
                                        {t('settingsPage.preview.description', {
                                            amount: SAMPLE_ROOM_RATE,
                                        })}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pl-10 sm:grid-cols-4">
                                    <div className="rounded-xl bg-muted/30 p-3">
                                        <p className="text-[11px] font-medium text-muted-foreground">
                                            {t('settingsPage.preview.total')}
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            ${preview.total.toFixed(2)}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {t('settingsPage.preview.tax', {
                                                rate: taxRate || '0',
                                            })}
                                            : ${preview.taxAmount.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-muted/30 p-3">
                                        <p className="text-[11px] font-medium text-muted-foreground">
                                            {t(
                                                'settingsPage.preview.electricity',
                                                {
                                                    units: SAMPLE_ELECTRIC_UNITS,
                                                },
                                            )}
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            ${preview.electricAmount.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-muted/30 p-3">
                                        <p className="text-[11px] font-medium text-muted-foreground">
                                            {t('settingsPage.preview.water', {
                                                units: SAMPLE_WATER_UNITS,
                                            })}
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            ${preview.waterAmount.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-muted/30 p-3">
                                        <p className="text-[11px] font-medium text-muted-foreground">
                                            {t('settingsPage.preview.lateFee')}
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            ${preview.lateFee.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing || !isDirty}
                                    className="h-11 rounded-xl px-8 font-sans text-sm font-semibold"
                                >
                                    {processing ? (
                                        <Spinner className="mr-2" />
                                    ) : (
                                        <Save className="mr-2 size-4" />
                                    )}
                                    {t('common.actions.save')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

AdminSettingsEdit.layout = {
    breadcrumbs: [{ title: 'Settings', href: settingsEdit() }],
};
