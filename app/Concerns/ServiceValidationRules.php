<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;

trait ServiceValidationRules
{
    /**
     * Get the validation rules used to validate services.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function serviceRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
