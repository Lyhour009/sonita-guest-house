<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $currency
 * @property float $tax_rate
 * @property string $default_checkin_time
 * @property string $default_checkout_time
 * @property float $electric_rate
 * @property float $water_rate
 * @property float $late_fee
 * @property string|null $payment_qr_url
 * @property string|null $payment_instruction
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'currency', 'tax_rate', 'default_checkin_time', 'default_checkout_time',
    'electric_rate', 'water_rate', 'late_fee', 'payment_qr_url', 'payment_instruction',
])]
class Setting extends Model
{
    use HasUuids;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tax_rate' => 'decimal:2',
            'electric_rate' => 'decimal:2',
            'water_rate' => 'decimal:2',
            'late_fee' => 'decimal:2',
        ];
    }
}
