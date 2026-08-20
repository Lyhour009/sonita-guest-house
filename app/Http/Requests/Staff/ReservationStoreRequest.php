<?php

namespace App\Http\Requests\Staff;

use App\Concerns\ReservationValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReservationStoreRequest extends FormRequest
{
    use ReservationValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            ...$this->reservationRules(),
            'guest_id' => [
                'required_without:new_guest',
                'nullable',
                'uuid',
                Rule::exists('users', 'id')->where('role', 'guest'),
            ],
            'new_guest' => ['required_without:guest_id', 'nullable', 'array'],
            'new_guest.full_name' => ['required_with:new_guest', 'string', 'max:255'],
            'new_guest.email' => ['required_with:new_guest', 'email', 'max:255', 'unique:users,email'],
        ];
    }
}
