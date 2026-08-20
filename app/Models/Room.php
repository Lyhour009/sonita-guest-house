<?php

namespace App\Models;

use Database\Factories\RoomFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'room_number', 'room_type', 'rental_mode', 'price_per_night', 'price_per_month',
    'status', 'floor', 'max_occupants', 'amenities', 'description',
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
}
