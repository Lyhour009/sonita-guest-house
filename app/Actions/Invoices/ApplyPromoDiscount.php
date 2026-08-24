<?php

namespace App\Actions\Invoices;

use App\Models\PromoCode;

class ApplyPromoDiscount
{
    /**
     * Resolve a promo code against a pre-tax subtotal and record its use.
     * Returns 0 for a missing, inactive, expired, or exhausted code — a bad
     * or stale code never blocks the invoice, it's simply ignored.
     */
    public function handle(?string $code, float $subtotal): float
    {
        if (! $code) {
            return 0.0;
        }

        $promoCode = PromoCode::query()->whereRaw('LOWER(code) = ?', [strtolower($code)])->first();

        if (! $promoCode || ! $promoCode->isRedeemable()) {
            return 0.0;
        }

        $discount = $promoCode->discountFor($subtotal);

        $promoCode->increment('used_count');

        return $discount;
    }
}
