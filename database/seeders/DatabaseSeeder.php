<?php

namespace Database\Seeders;

use App\Models\PromoCode;
use App\Models\Service;
use App\Models\Setting;
use App\Models\User;
use App\Models\WaitlistEntry;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database with a realistic, internally consistent demo dataset.
     *
     * Reservation/payment/maintenance state is produced by driving the same Action classes
     * the real app uses, rather than hand-writing rows, so room statuses, invoice totals,
     * and notifications stay consistent with production behaviour.
     */
    public function run(): void
    {
        User::factory()->admin()->create([
            'full_name' => 'Admin Hour',
            'email' => 'admin@example.com',
        ]);

        User::factory()->receptionist()->create([
            'full_name' => 'Receptionist Staff',
            'email' => 'receptionist@example.com',
        ]);

        User::factory()->housekeeping()->create([
            'full_name' => 'Housekeeping Staff',
            'email' => 'housekeeping@example.com',
        ]);

        User::factory()->create([
            'full_name' => 'Demo Guest',
            'email' => 'guest@example.com',
        ]);

        User::factory(2)->create();

        // Call Room Seeder
        $this->call(RoomSeeder::class);
        $this->call(RoomImageSeeder::class);

        collect([
            ['name' => 'Breakfast', 'price' => 3.00],
            ['name' => 'Laundry Service', 'price' => 2.50],
            ['name' => 'Airport Pickup', 'price' => 12.00],
            ['name' => 'Tuk Tuk Rental (Half-Day)', 'price' => 8.00],
            ['name' => 'Motorbike Rental (Per Day)', 'price' => 6.00],
            ['name' => 'Bicycle Rental (Per Day)', 'price' => 3.00],
            ['name' => 'Late Check-out', 'price' => 5.00],
            ['name' => 'Extra Bed', 'price' => 7.00],
            ['name' => 'SIM Card & Wi-Fi Setup', 'price' => 3.00],
            ['name' => 'Traditional Khmer Massage', 'price' => 15.00],
        ])->each(fn (array $service) => Service::create($service));

        Setting::create([
            'currency' => 'USD',
            'tax_rate' => 10,
            'default_checkin_time' => '14:00',
            'default_checkout_time' => '12:00',
            'electric_rate' => 0.25,
            'water_rate' => 0.15,
            'late_fee' => 5,
            'payment_qr_url' => null,
            'payment_instruction' => 'Pay via bank transfer or the QR code at reception.',
        ]);

        // Promo codes exist before reservations are seeded so some seeded bookings redeem one.
        PromoCode::create([
            'code' => 'WELCOME10',
            'discount_type' => 'percent',
            'discount_value' => 10,
            'active' => true,
        ]);

        PromoCode::create([
            'code' => 'STAY20',
            'discount_type' => 'fixed',
            'discount_value' => 20,
            'active' => true,
            'max_uses' => 20,
        ]);

        PromoCode::create([
            'code' => 'SUMMER5',
            'discount_type' => 'percent',
            'discount_value' => 5,
            'active' => true,
            'expires_at' => now()->subDays(10),
        ]);

        PromoCode::create([
            'code' => 'KHMERNEWYEAR15',
            'discount_type' => 'percent',
            'discount_value' => 15,
            'active' => true,
            'expires_at' => now()->addMonths(3),
        ]);

        PromoCode::create([
            'code' => 'LONGSTAY50',
            'discount_type' => 'fixed',
            'discount_value' => 50,
            'active' => true,
        ]);

        PromoCode::create([
            'code' => 'FLASH25',
            'discount_type' => 'percent',
            'discount_value' => 25,
            'active' => true,
            'max_uses' => 5,
        ]);

        PromoCode::create([
            'code' => 'RETIRED10',
            'discount_type' => 'percent',
            'discount_value' => 10,
            'active' => false,
        ]);

        // A spread of guests who searched a fully-booked date range and left their contact info.
        collect(['Sreymom', 'Vibol', 'Chenda', 'Pisach', 'Ratha', 'Malis', 'Sopheak', 'Kunthea', 'Vantha', 'Sreyneang', 'Bunthoeun', 'Channary'])
            ->each(function (string $name, int $index) {
                $stayType = $index % 3 === 0 ? 'long_stay' : 'short_stay';
                $fromDate = now()->addDays(rand(3, 30));

                WaitlistEntry::create([
                    'email' => strtolower($name).'.waitlist@example.com',
                    'phone_number' => rand(0, 1) ? '0'.rand(1, 9).rand(1000000, 9999999) : null,
                    'stay_type' => $stayType,
                    'from_date' => $fromDate->toDateString(),
                    'to_date' => $stayType === 'short_stay' ? $fromDate->copy()->addDays(rand(1, 5))->toDateString() : null,
                    'notified_at' => rand(1, 100) <= 40 ? now()->subDays(rand(1, 10)) : null,
                ]);
            });

        // Call Reservation Seeder for ~50 realistic reservations
        $this->call(ReservationSeeder::class);

        // Maintenance: ~50 requests spread across rooms in varied states
        $this->call(MaintenanceRequestSeeder::class);
    }
}
