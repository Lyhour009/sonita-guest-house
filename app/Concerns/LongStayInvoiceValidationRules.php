<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait LongStayInvoiceValidationRules
{
    /**
     * Get the validation rules used to validate long-stay invoice generation.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function longStayInvoiceRules(): array
    {
        return [
            'reservation_id' => [
                'required',
                'uuid',
                Rule::exists('reservations', 'id')
                    ->where('reservation_type', 'long_stay')
                    ->where('status', 'active'),
            ],
            'billing_period' => ['nullable', 'date'],
            'elec_meter_start' => ['required', 'numeric', 'min:0'],
            'elec_meter_end' => ['required', 'numeric', 'gte:elec_meter_start'],
            'water_meter_start' => ['required', 'numeric', 'min:0'],
            'water_meter_end' => ['required', 'numeric', 'gte:water_meter_start'],
        ];
    }
}
