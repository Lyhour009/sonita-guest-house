<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;

trait SettingValidationRules
{
    /**
     * Get the validation rules used to validate settings.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function settingRules(): array
    {
        return [
            'currency' => ['required', 'string', 'size:3'],
            'tax_rate' => ['required', 'numeric', 'min:0'],
            'default_checkin_time' => ['required', 'date_format:H:i'],
            'default_checkout_time' => ['required', 'date_format:H:i'],
            'electric_rate' => ['required', 'numeric', 'min:0'],
            'water_rate' => ['required', 'numeric', 'min:0'],
            'late_fee' => ['required', 'numeric', 'min:0'],
            'payment_qr_url' => ['nullable', 'url', 'max:255'],
            'payment_instruction' => ['nullable', 'string'],
        ];
    }
}
