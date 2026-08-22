<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [];
        $floors = 5;
        $roomsPerFloor = 10;
        
        $types = ['Standard', 'Deluxe', 'Suite', 'Family'];
        
        for ($f = 1; $f <= $floors; $f++) {
            for ($r = 1; $r <= $roomsPerFloor; $r++) {
                $type = $types[array_rand($types)];
                // Evenly distribute modes based on type or random
                $mode = rand(1, 100) > 60 ? 'both' : (rand(1, 100) > 50 ? 'long_stay' : 'short_stay');
                
                $pricePerNight = match($type) {
                    'Standard' => 15.00,
                    'Deluxe' => 25.00,
                    'Family' => 35.00,
                    'Suite' => 45.00,
                };
                
                $pricePerMonth = match($type) {
                    'Standard' => 250.00,
                    'Deluxe' => 350.00,
                    'Family' => 450.00,
                    'Suite' => 600.00,
                };
                
                $maxOccupants = match($type) {
                    'Standard' => 2,
                    'Deluxe' => 2,
                    'Family' => 4,
                    'Suite' => 3,
                };
                
                $rooms[] = [
                    'id' => \Illuminate\Support\Str::uuid(),
                    'room_number' => sprintf('%d%02d', $f, $r),
                    'room_type' => $type,
                    'rental_mode' => $mode,
                    'price_per_night' => $pricePerNight,
                    'price_per_month' => $pricePerMonth,
                    'status' => 'available',
                    'floor' => $f,
                    'max_occupants' => $maxOccupants,
                    'amenities' => 'Wi-Fi, Air Conditioning, Hot Water, Smart TV, Fridge',
                    'description' => 'A comfortable ' . strtolower($type) . ' room perfect for your stay.',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        DB::table('rooms')->insert($rooms);
    }
}
