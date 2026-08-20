<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;

trait ReservationValidationRules
{
    /**
     * Get the validation rules used to validate reservations.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function reservationRules(): array
    {
        return [
            'room_id' => ['required', 'uuid', 'exists:rooms,id'],
            'reservation_type' => ['required', 'string', 'in:short_stay,long_stay'],
            'check_in_date' => ['required_if:reservation_type,short_stay', 'nullable', 'date', 'after_or_equal:today'],
            'check_out_date' => ['required_if:reservation_type,short_stay', 'nullable', 'date', 'after:check_in_date'],
            'num_guests' => ['required_if:reservation_type,short_stay', 'nullable', 'integer', 'min:1'],
            'start_date' => ['required_if:reservation_type,long_stay', 'nullable', 'date', 'after_or_equal:today'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
        ];
    }
}
