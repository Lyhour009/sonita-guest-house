<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PaymentProofController extends Controller
{
    /**
     * Stream a payment's private proof image to its owner or staff.
     */
    public function show(Request $request, Payment $payment): StreamedResponse
    {
        $user = $request->user();

        abort_unless(
            $payment->guest_id === $user->id || in_array($user->role, ['admin', 'receptionist'], strict: true),
            403,
        );

        abort_if($payment->proof_image === null, 404);

        return Storage::disk('local')->response($payment->proof_image);
    }
}
