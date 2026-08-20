<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;

trait PaymentValidationRules
{
    /**
     * Get the validation rules used to validate payments.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function paymentRules(): array
    {
        return [
            'invoice_id' => ['required', 'uuid', 'exists:invoices,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'method' => ['required', 'string', 'in:cash,bank_transfer,qr'],
            'proof_image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ];
    }
}
