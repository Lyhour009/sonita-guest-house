<?php

namespace App\Models;

use Database\Factories\PromoCodeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $code
 * @property string $discount_type
 * @property float $discount_value
 * @property bool $active
 * @property Carbon|null $expires_at
 * @property int|null $max_uses
 * @property int $used_count
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['code', 'discount_type', 'discount_value', 'active', 'expires_at', 'max_uses', 'used_count'])]
class PromoCode extends Model
{
    /** @use HasFactory<PromoCodeFactory> */
    use HasFactory, HasUuids;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'discount_value' => 'decimal:2',
            'active' => 'boolean',
            'expires_at' => 'date',
            'max_uses' => 'integer',
            'used_count' => 'integer',
        ];
    }

    /**
     * Whether this code can currently be redeemed (active, unexpired, under its use limit).
     */
    public function isRedeemable(): bool
    {
        if (! $this->active) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) {
            return false;
        }

        return true;
    }

    /**
     * Compute this code's discount against a pre-tax subtotal, capped so it can never exceed it.
     */
    public function discountFor(float $subtotal): float
    {
        $discount = $this->discount_type === 'percent'
            ? $subtotal * ((float) $this->discount_value / 100)
            : (float) $this->discount_value;

        return round(min($discount, $subtotal), 2);
    }
}
