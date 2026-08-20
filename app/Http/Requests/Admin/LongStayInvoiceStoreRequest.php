<?php

namespace App\Http\Requests\Admin;

use App\Concerns\LongStayInvoiceValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LongStayInvoiceStoreRequest extends FormRequest
{
    use LongStayInvoiceValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->longStayInvoiceRules();
    }
}
