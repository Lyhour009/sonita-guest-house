<?php

namespace App\Concerns;

use App\Models\Room;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait RoomValidationRules
{
    /**
     * Get the validation rules used to validate rooms.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function roomRules(?string $roomId = null): array
    {
        return [
            'room_number' => [
                'required',
                'string',
                'max:255',
                $roomId === null
                    ? Rule::unique(Room::class)
                    : Rule::unique(Room::class)->ignore($roomId),
            ],
            'room_type' => ['required', 'string', 'max:255'],
            'rental_mode' => ['required', 'string', 'in:short_stay,long_stay,both'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'price_per_month' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'in:available,occupied,reserved,cleaning,maintenance'],
            'floor' => ['nullable', 'integer'],
            'max_occupants' => ['required', 'integer', 'min:1'],
            'amenities' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:5120'],
        ];
    }
}
