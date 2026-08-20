<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;

trait MaintenanceValidationRules
{
    /**
     * Get the validation rules used to validate maintenance requests.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function maintenanceRequestRules(): array
    {
        return [
            'room_id' => ['required', 'uuid', 'exists:rooms,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority' => ['required', 'string', 'in:low,medium,high'],
        ];
    }
}
