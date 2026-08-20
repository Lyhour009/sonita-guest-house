<?php

namespace App\Http\Requests\Admin;

use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StaffAccountUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var User $staff */
        $staff = $this->route('staff');

        return [
            'full_name' => $this->fullNameRules(),
            'email' => $this->emailRules($staff->id),
            'phone_number' => ['nullable', 'string', 'max:255'],
            'role' => ['required', 'string', 'in:receptionist,housekeeping'],
            'password' => ['nullable', 'string', Password::default(), 'confirmed'],
        ];
    }
}
