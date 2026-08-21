<?php

namespace App\Models;

use Database\Factories\InvoiceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $reservation_id
 * @property string $invoice_type
 * @property Carbon|null $billing_period
 * @property float $room_charge
 * @property float $service_charge
 * @property float|null $utility_charge
 * @property float|null $elec_meter_start
 * @property float|null $elec_meter_end
 * @property float|null $water_meter_start
 * @property float|null $water_meter_end
 * @property float $tax_amount
 * @property float $total_amount
 * @property string $status
 * @property Carbon|null $due_date
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'reservation_id', 'invoice_type', 'billing_period', 'room_charge', 'service_charge',
    'utility_charge', 'elec_meter_start', 'elec_meter_end', 'water_meter_start', 'water_meter_end',
    'tax_amount', 'total_amount', 'status', 'due_date',
])]
class Invoice extends Model
{
    /** @use HasFactory<InvoiceFactory> */
    use HasFactory, HasUuids;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'billing_period' => 'date',
            'room_charge' => 'decimal:2',
            'service_charge' => 'decimal:2',
            'utility_charge' => 'decimal:2',
            'elec_meter_start' => 'decimal:2',
            'elec_meter_end' => 'decimal:2',
            'water_meter_start' => 'decimal:2',
            'water_meter_end' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'due_date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<Reservation, $this>
     */
    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    /**
     * @return HasMany<Payment, $this>
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Sum of this invoice's confirmed payments. Uses the loaded `payments`
     * relation when available, otherwise queries it directly.
     */
    public function confirmedPaidTotal(): float
    {
        $payments = $this->relationLoaded('payments')
            ? $this->payments->where('status', 'confirmed')
            : $this->payments()->where('status', 'confirmed')->get();

        return (float) $payments->sum('amount');
    }

    public function outstandingBalance(): float
    {
        return round((float) $this->total_amount - $this->confirmedPaidTotal(), 2);
    }
}
