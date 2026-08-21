<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SettingUpdateRequest;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Display the settings form.
     */
    public function edit(): Response
    {
        $setting = $this->currentSetting();

        return Inertia::render('admin/settings/edit', [
            'setting' => [
                'currency' => $setting->currency,
                'tax_rate' => $setting->tax_rate,
                'default_checkin_time' => substr($setting->default_checkin_time, 0, 5),
                'default_checkout_time' => substr($setting->default_checkout_time, 0, 5),
                'electric_rate' => $setting->electric_rate,
                'water_rate' => $setting->water_rate,
                'late_fee' => $setting->late_fee,
                'payment_qr_url' => $setting->payment_qr_url,
                'payment_instruction' => $setting->payment_instruction,
            ],
        ]);
    }

    /**
     * Update the settings.
     */
    public function update(SettingUpdateRequest $request): RedirectResponse
    {
        $this->currentSetting()->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.settings.updated']);

        return to_route('admin.settings.edit');
    }

    private function currentSetting(): Setting
    {
        return Setting::firstOrCreate([], [
            'currency' => 'USD',
            'tax_rate' => 0,
            'default_checkin_time' => '14:00',
            'default_checkout_time' => '12:00',
            'electric_rate' => 0,
            'water_rate' => 0,
            'late_fee' => 0,
        ]);
    }
}
