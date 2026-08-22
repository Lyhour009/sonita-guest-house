<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ReservationService extends Pivot
{
    use HasUuids;

    protected $table = 'reservation_service';

    public $incrementing = false;

    protected $keyType = 'string';
}
