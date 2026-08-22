<?php

namespace Database\Seeders;

use App\Actions\Reservations\CreateGuestReservation;
use App\Actions\Reservations\ConfirmReservation;
use App\Actions\Reservations\CheckInReservation;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class RealisticReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $khmerNames = [
            'Sokha Tep', 'Chea Vuthy', 'Mao Sreymao', 'Meas Piseth', 'Pich Vanna',
            'Keo Sothy', 'Chhorn Sovann', 'Oum Bopha', 'Khim Rithy', 'Chan Sopheak',
            'Heng Nita', 'Chhoeun Kimseng', 'Phan Visal', 'Srey Vutha', 'Leng Sothea',
            'Vong Dara', 'Sin Somnang', 'Bou Chamroeun', 'Tith Sreynich', 'Nguon Tola',
            'Cheam Panha', 'Sun Raksa', 'Ly Minea', 'Yim Sophea', 'Kong Makara',
            'Eam Sambath', 'Prak Sitha', 'Lork Ratanak', 'Men Socheat', 'Yorn Chantha',
            'Say Sreyneath', 'Chhan Vicheka', 'Sim Borey', 'Nuon Rasmey', 'Din Sophal',
            'Seng Tith', 'Phal Veasna', 'Chou Nary', 'Tuy Sreyleak', 'Mok Chan',
            'Chhay Mony', 'Kim Sreypich', 'Nop Bunna', 'Peou Kolap', 'Thy Sophal',
            'Touch Samnang', 'Nhem Chanthou', 'Lon Kesor', 'Hok Vandy', 'Pen Rith'
        ];

        // Create 50 guests
        $guests = collect($khmerNames)->map(function ($name, $index) {
            $email = strtolower(str_replace(' ', '.', $name)) . '@example.com';
            return User::firstOrCreate(
                ['email' => $email],
                [
                    'id' => (string) \Illuminate\Support\Str::uuid(),
                    'full_name' => $name,
                    'phone_number' => '0' . rand(10, 99) . rand(100000, 999999),
                    'role' => 'guest',
                    'password' => bcrypt('password'),
                ]
            );
        });

        $rooms = Room::all();
        if ($rooms->isEmpty()) {
            $rooms = Room::factory(10)->create(['rental_mode' => 'short_stay']);
        }

        // Keep track of the last check-out date per room
        $roomLastDates = [];
        foreach ($rooms as $room) {
            $roomLastDates[$room->id] = Carbon::now()->subDays(60);
        }

        $createReservation = app(CreateGuestReservation::class);
        $confirmReservation = app(ConfirmReservation::class);
        $checkInReservation = app(CheckInReservation::class);

        $statuses = ['pending', 'confirmed', 'checked_in', 'checked_out'];

        foreach ($guests as $index => $guest) {
            $room = $rooms->random();
            $status = $statuses[array_rand($statuses)];
            
            // Start the next reservation a few days after the room's last check-out
            $startDate = (clone $roomLastDates[$room->id])->addDays(rand(1, 5));
            $endDate = (clone $startDate)->addDays(rand(1, 14));

            // Update the room's last known date
            $roomLastDates[$room->id] = $endDate;

            $reservation = $createReservation->handle($guest, [
                'room_id' => $room->id,
                'reservation_type' => 'short_stay',
                'check_in_date' => $startDate->toDateString(),
                'check_out_date' => $endDate->toDateString(),
                'num_guests' => rand(1, $room->max_occupants ?? 2),
            ]);

            if (in_array($status, ['confirmed', 'checked_in', 'checked_out'])) {
                $confirmReservation->handle($reservation);
            }

            // Only check-in if the start date is today or in the past
            if (in_array($status, ['checked_in', 'checked_out']) && $startDate->isPast()) {
                $checkInReservation->handle($reservation);
            }
        }
    }
}
