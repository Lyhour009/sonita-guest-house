import { Form, Head } from '@inertiajs/react';
import SettingController from '@/actions/App/Http/Controllers/Admin/SettingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { edit as settingsEdit } from '@/routes/admin/settings';
import type { AppSettings } from '@/types';

type Props = {
    setting: AppSettings;
};

export default function AdminSettingsEdit({ setting }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('settingsPage.title')} />

            <div className="max-w-2xl space-y-6 p-4">
                <Heading
                    title={t('settingsPage.title')}
                    description={t('settingsPage.description')}
                />

                <Form
                    {...SettingController.update.form()}
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="currency">
                                        {t('settingsPage.fields.currency')}
                                    </Label>
                                    <Input
                                        id="currency"
                                        name="currency"
                                        maxLength={3}
                                        defaultValue={setting.currency}
                                        required
                                    />
                                    <InputError message={errors.currency} />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="tax_rate">
                                        {t('settingsPage.fields.taxRate')}
                                    </Label>
                                    <Input
                                        id="tax_rate"
                                        name="tax_rate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        defaultValue={setting.tax_rate}
                                        required
                                    />
                                    <InputError message={errors.tax_rate} />
                                </div>
                            </div>

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
                                        message={errors.default_checkin_time}
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
                                        message={errors.default_checkout_time}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="electric_rate">
                                        {t('settingsPage.fields.electricRate')}
                                    </Label>
                                    <Input
                                        id="electric_rate"
                                        name="electric_rate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        defaultValue={setting.electric_rate}
                                        required
                                    />
                                    <InputError
                                        message={errors.electric_rate}
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="water_rate">
                                        {t('settingsPage.fields.waterRate')}
                                    </Label>
                                    <Input
                                        id="water_rate"
                                        name="water_rate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        defaultValue={setting.water_rate}
                                        required
                                    />
                                    <InputError message={errors.water_rate} />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="late_fee">
                                        {t('settingsPage.fields.lateFee')}
                                    </Label>
                                    <Input
                                        id="late_fee"
                                        name="late_fee"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        defaultValue={setting.late_fee}
                                        required
                                    />
                                    <InputError message={errors.late_fee} />
                                </div>
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="payment_qr_url">
                                    {t('settingsPage.fields.paymentQrUrl')}
                                </Label>
                                <Input
                                    id="payment_qr_url"
                                    name="payment_qr_url"
                                    type="url"
                                    defaultValue={setting.payment_qr_url ?? ''}
                                />
                                <InputError message={errors.payment_qr_url} />
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
                                        setting.payment_instruction ?? ''
                                    }
                                />
                                <InputError
                                    message={errors.payment_instruction}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>
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
