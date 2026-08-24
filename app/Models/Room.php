<?php

namespace App\Models;

use Database\Factories\RoomFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $room_number
 * @property string $room_type
 * @property string $rental_mode
 * @property float $price_per_night
 * @property float $price_per_month
 * @property string $status
 * @property int|null $floor
 * @property int $max_occupants
 * @property string|null $amenities
 * @property string|null $description
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'room_number', 'room_type', 'rental_mode', 'price_per_night', 'price_per_month',
    'status', 'floor', 'max_occupants', 'amenities', 'description', 'notes',
])]
class Room extends Model
{
    /** @use HasFactory<RoomFactory> */
    use HasFactory, HasUuids;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price_per_night' => 'decimal:2',
            'price_per_month' => 'decimal:2',
            'floor' => 'integer',
            'max_occupants' => 'integer',
        ];
    }

    /**
     * @return HasMany<Reservation, $this>
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * @return HasMany<RoomImage, $this>
     */
    public function roomImages(): HasMany
    {
        return $this->hasMany(RoomImage::class);
    }

    /**
     * @return HasMany<MaintenanceRequest, $this>
     */
    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class);
    }

    /**
     * @return HasManyThrough<Review, Reservation, $this>
     */
    public function reviews(): HasManyThrough
    {
        return $this->hasManyThrough(Review::class, Reservation::class);
    }

    /**
     * Scope rooms that have no active reservation overlapping the given date range.
     *
     * @param  Builder<Room>  $query
     * @return Builder<Room>
     */
    public function scopeAvailableBetween(Builder $query, string $stayType, Carbon $from, Carbon $to): Builder
    {
        return $query->whereDoesntHave('reservations', function (Builder $reservations) use ($stayType, $from, $to) {
            $reservations->whereIn('status', ['pending', 'confirmed', 'checked_in', 'active']);

            if ($stayType === 'long_stay') {
                $reservations->where('start_date', '<', $to)
                    ->where(function (Builder $overlapping) use ($from) {
                        $overlapping->whereNull('end_date')->orWhere('end_date', '>', $from);
                    });
            } else {
                $reservations->where('check_in_date', '<', $to)
                    ->where('check_out_date', '>', $from);
            }
        });
    }
}
