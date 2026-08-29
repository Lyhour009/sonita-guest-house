<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [];
        $floors = 4;
        $roomsPerFloor = 6;

        for ($f = 1; $f <= $floors; $f++) {
            for ($r = 1; $r <= $roomsPerFloor; $r++) {
                $roomNumber = sprintf('%d%02d', $f, $r);

                if ($f === 1) {
                    $type = $r <= 4 ? 'Standard' : 'Deluxe';
                    $mode = 'both';
                    $priceNight = $type === 'Standard' ? 12.00 : 18.00;
                    $priceMonth = $type === 'Standard' ? 120.00 : 160.00;
                    $maxOccupants = 2;
                } elseif ($f === 2) {
                    $type = 'Standard';
                    $mode = 'short_stay';
                    $priceNight = 18.00;
                    $priceMonth = 160.00;
                    $maxOccupants = 2;
                } elseif ($f === 3) {
                    $type = 'Deluxe';
                    $mode = 'long_stay';
                    $priceNight = 25.00;
                    $priceMonth = 220.00;
                    $maxOccupants = 2;
                } else {
                    $type = $r <= 4 ? 'Deluxe' : 'Family';
                    $mode = 'both';
                    $priceNight = $type === 'Deluxe' ? 25.00 : 40.00;
                    $priceMonth = $type === 'Deluxe' ? 220.00 : 320.00;
                    $maxOccupants = $type === 'Deluxe' ? 2 : 4;
                }

                $rooms[] = [
                    'id' => (string) Str::uuid(),
                    'room_number' => $roomNumber,
                    'room_type' => $type,
                    'rental_mode' => $mode,
                    'price_per_night' => $priceNight,
                    'price_per_month' => $priceMonth,
                    'status' => 'available',
                    'floor' => $f,
                    'max_occupants' => $maxOccupants,
                    'amenities' => 'Wi-Fi, Air Conditioning, Hot Water, Smart TV, Fridge',
                    'description' => "A comfortable {$type} room equipped with all basic amenities.",
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('rooms')->insert($rooms);
    }
}
