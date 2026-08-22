<?php

namespace Database\Seeders;

use App\Actions\Reservations\CheckInReservation;
use App\Actions\Reservations\CheckOutReservation;
use App\Actions\Reservations\ConfirmReservation;
use App\Actions\Reservations\CreateGuestReservation;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $createGuestReservation = app(CreateGuestReservation::class);
        $confirmReservation = app(ConfirmReservation::class);
        $checkInReservation = app(CheckInReservation::class);
        $checkOutReservation = app(CheckOutReservation::class);

        $firstNames = ['Sokha', 'Chea', 'Sovann', 'Bopha', 'Nita', 'Dara', 'Panha', 'Vibol', 'Sophea', 'Chann', 'Rithy', 'Vanny', 'Mony', 'Kesor', 'Sok', 'Sao', 'Mao', 'Chan', 'Kim', 'Pich', 'Piseth', 'Sreypich', 'Sreyleak', 'Rathana'];
        $lastNames = ['Seng', 'Chhun', 'Sok', 'Pen', 'Keo', 'Meas', 'Ros', 'Chhan', 'Khieu', 'Nget', 'Prak', 'Kong', 'Men', 'Tep', 'Lim', 'Heng', 'Ouk', 'Cheam', 'Bou'];

        $rooms = Room::all();
        if ($rooms->isEmpty()) {
            $this->command->warn('No rooms found. Skipping reservation seeding.');
            return;
        }

        $guests = [];
        for ($i = 0; $i < 40; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $fullName = $lastName . ' ' . $firstName;
            $email = strtolower(Str::ascii($firstName)) . rand(10, 99) . '@example.com';
            
            $guests[] = User::create([
                'full_name' => $fullName,
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'guest',
                'phone_number' => '0' . rand(1, 9) . rand(1000000, 9999999),
            ]);
        }

        for ($i = 0; $i < 50; $i++) {
            $guest = $guests[array_rand($guests)];
            // Get random available room to avoid conflicts if they are concurrent
            $room = $rooms->random();
            
            // Randomly decide reservation state
            $state = rand(1, 100);
            
            // Generate realistic dates
            $daysAgo = rand(0, 30);
            $duration = rand(1, 5);
            
            $checkInDate = now()->subDays($daysAgo);
            $checkOutDate = (clone $checkInDate)->addDays($duration);
            
            $type = ($room->rental_mode === 'both') 
                ? (rand(1, 10) > 8 ? 'long_stay' : 'short_stay') 
                : $room->rental_mode;

            if ($type === 'long_stay') {
                $durationMonths = rand(1, 6);
                $checkOutDate = (clone $checkInDate)->addMonths($durationMonths);
                
                $data = [
                    'room_id' => $room->id,
                    'reservation_type' => 'long_stay',
                    'start_date' => $checkInDate->toDateString(),
                    'end_date' => (rand(1,10) > 5) ? $checkOutDate->toDateString() : null, // some open ended
                    'monthly_due_day' => $checkInDate->day <= 28 ? $checkInDate->day : 1,
                ];
            } else {
                $data = [
                    'room_id' => $room->id,
                    'reservation_type' => 'short_stay',
                    'check_in_date' => $checkInDate->toDateString(),
                    'check_out_date' => $checkOutDate->toDateString(),
                    'num_guests' => rand(1, $room->max_occupants),
                ];
            }

            try {
                // If it's in the past and checkout is in the past, it should be checked out
                $reservation = $createGuestReservation->handle($guest, $data);
                $confirmReservation->handle($reservation);

                if ($checkInDate->isPast()) {
                    $checkInReservation->handle($reservation);
                    
                    if ($checkOutDate->isPast() && $type === 'short_stay') {
                        $checkOutReservation->handle($reservation);
                        // Room is 'cleaning' now, reset to 'available' to allow next bookings
                        $room->update(['status' => 'available']);
                    }
                }
            } catch (\Exception $e) {
                // Room might be occupied during this exact date overlap due to randomization, just skip
                continue;
            }
        }
    }
}
