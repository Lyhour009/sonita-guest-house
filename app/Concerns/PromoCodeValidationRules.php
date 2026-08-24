<?php

namespace App\Concerns;

use App\Models\PromoCode;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait PromoCodeValidationRules
{
    /**
     * Get the validation rules used to validate promo codes.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function promoCodeRules(?string $promoCodeId = null): array
    {
        return [
            'code' => [
                'required',
                'string',
                'max:50',
                $promoCodeId === null
                    ? Rule::unique(PromoCode::class)
                    : Rule::unique(PromoCode::class)->ignore($promoCodeId),
            ],
            'discount_type' => ['required', 'string', 'in:percent,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'active' => ['boolean'],
            'expires_at' => ['nullable', 'date'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
