<?php

namespace App\Models;

use Database\Factories\ReservationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $guest_id
 * @property string $room_id
 * @property string $reservation_type
 * @property Carbon|null $check_in_date
 * @property Carbon|null $check_out_date
 * @property Carbon|null $start_date
 * @property Carbon|null $end_date
 * @property float|null $deposit_amount
 * @property int|null $monthly_due_day
 * @property int|null $num_guests
 * @property string $status
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'guest_id', 'room_id', 'reservation_type', 'check_in_date', 'check_out_date',
    'start_date', 'end_date', 'deposit_amount', 'monthly_due_day', 'num_guests', 'status', 'notes',
])]
class Reservation extends Model
{
    /** @use HasFactory<ReservationFactory> */
    use HasFactory, HasUuids;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'check_in_date' => 'date',
            'check_out_date' => 'date',
            'start_date' => 'date',
            'end_date' => 'date',
            'deposit_amount' => 'decimal:2',
            'monthly_due_day' => 'integer',
            'num_guests' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function guest(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guest_id');
    }

    /**
     * @return BelongsTo<Room, $this>
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * @return HasMany<Invoice, $this>
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /**
     * @return BelongsToMany<Service, $this, ReservationService>
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'reservation_service')
            ->using(ReservationService::class)
            ->withPivot('id', 'quantity', 'unit_price')
            ->withTimestamps();
    }

    /**
     * Get the total amount for the reservation (calculated on the fly if no invoice exists).
     */
    protected function totalAmount(): Attribute
    {
        return Attribute::get(function () {
            if ($this->relationLoaded('invoices') && $this->invoices->isNotEmpty()) {
                return $this->invoices->sortByDesc('created_at')->first()->total_amount;
            }

            if ($this->reservation_type === 'short_stay' && $this->check_in_date && $this->check_out_date && $this->relationLoaded('room') && $this->room) {
                $nights = max(1, $this->check_in_date->diffInDays($this->check_out_date));

                return $this->room->price_per_night * $nights;
            }

            if ($this->reservation_type === 'long_stay' && $this->relationLoaded('room') && $this->room) {
                return $this->room->price_per_month;
            }

            return 0;
        });
    }
}
