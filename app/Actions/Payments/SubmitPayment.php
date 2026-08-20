<?php

namespace App\Actions\Payments;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\UploadedFile;

class SubmitPayment
{
    /**
     * @param  array{amount: float|string, method: string, proof_image?: UploadedFile|null}  $data
     */
    public function handle(User $guest, Invoice $invoice, array $data): Payment
    {
        $proofPath = isset($data['proof_image'])
            ? $data['proof_image']->store('payment-proofs', 'local')
            : null;

        return $invoice->payments()->create([
            'guest_id' => $guest->id,
            'amount' => $data['amount'],
            'method' => $data['method'],
            'proof_image' => $proofPath,
            'status' => 'pending',
        ]);
    }
}
