<?php

namespace Database\Seeders;

use App\Actions\Reservations\CheckInReservation;
use App\Actions\Reservations\ConfirmReservation;
use App\Actions\Reservations\CreateGuestReservation;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class RealisticReservationSeeder extends Seeder
{
    public function run(): void
    {
        $khmerNames = [
            'Sokha Tep',
            'Chea Vuthy',
            'Mao Sreymao',
            'Meas Piseth',
            'Pich Vanna',
            'Keo Sothy',
            'Chhorn Sovann',
            'Oum Bopha',
            'Khim Rithy',
            'Chan Sopheak',
            'Heng Nita',
            'Chhoeun Kimseng',
            'Phan Visal',
            'Srey Vutha',
            'Leng Sothea',
        ];

        $guests = collect($khmerNames)->map(function ($name) {
            $email = strtolower(str_replace(' ', '.', $name)).'@example.com';

            return User::firstOrCreate(
                ['email' => $email],
                [
                    'id' => (string) Str::uuid(),
                    'full_name' => $name,
                    'phone_number' => '0'.rand(12, 99).rand(100000, 999999),
                    'role' => 'guest',
                    'password' => bcrypt('password'),
                ]
            );
        });

        $rooms = Room::whereIn('rental_mode', ['short_stay', 'both'])->get();
        if ($rooms->isEmpty()) {
            return;
        }

        $roomLastDates = [];
        foreach ($rooms as $room) {
            $roomLastDates[$room->id] = Carbon::now()->subDays(30);
        }

        $createReservation = app(CreateGuestReservation::class);
        $confirmReservation = app(ConfirmReservation::class);
        $checkInReservation = app(CheckInReservation::class);

        $statuses = ['pending', 'confirmed', 'checked_in'];

        foreach ($guests as $guest) {
            $room = $rooms->random();
            $status = $statuses[array_rand($statuses)];

            $startDate = (clone $roomLastDates[$room->id])->addDays(rand(1, 3));
            $endDate = (clone $startDate)->addDays(rand(1, 5));

            $roomLastDates[$room->id] = $endDate;

            try {
                $reservation = $createReservation->handle($guest, [
                    'room_id' => $room->id,
                    'reservation_type' => 'short_stay',
                    'check_in_date' => $startDate->toDateString(),
                    'check_out_date' => $endDate->toDateString(),
                    'num_guests' => rand(1, $room->max_occupants ?? 2),
                ]);

                if (in_array($status, ['confirmed', 'checked_in'])) {
                    $confirmReservation->handle($reservation);
                }

                if ($status === 'checked_in' && $startDate->isPast()) {
                    $checkInReservation->handle($reservation);
                }
            } catch (\Exception $e) {
                continue;
            }
        }
    }
}
