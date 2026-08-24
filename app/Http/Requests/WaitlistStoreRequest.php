<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class WaitlistStoreRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:30'],
            'stay_type' => ['required', 'string', 'in:short_stay,long_stay'],
            'from_date' => ['nullable', 'date'],
            'to_date' => ['nullable', 'date', 'after:from_date'],
        ];
    }
}
