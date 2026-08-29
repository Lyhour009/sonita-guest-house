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

    public function run(): void
    {
        // 1. Core Users with standard test credentials
        User::factory()->admin()->create([
            'full_name' => 'Chan Socheat (Admin)',
            'email' => 'admin@example.com',
        ]);

        User::factory()->receptionist()->create([
            'full_name' => 'Meas Sokha (Reception)',
            'email' => 'receptionist@example.com',
        ]);

        User::factory()->housekeeping()->create([
            'full_name' => 'Sok Sopheak (Cleaner)',
            'email' => 'housekeeping@example.com',
        ]);

        User::factory()->create([
            'full_name' => 'Sovann Dara (Guest)',
            'email' => 'guest@example.com',
        ]);

        User::factory(2)->create();

        // 2. Seed 24 Rooms & Images
        $this->call(RoomSeeder::class);
        $this->call(RoomImageSeeder::class);

        // 3. Extra Services (Cambodia Context)
        collect([
            ['name' => 'Breakfast Set', 'price' => 3.50],
            ['name' => 'Laundry Service (per kg)', 'price' => 1.25],
            ['name' => 'Airport Tuk-Tuk Transfer', 'price' => 12.00],
            ['name' => 'Tuk-Tuk Rental (Half-Day)', 'price' => 8.00],
            ['name' => 'Motorbike Rental (Per Day)', 'price' => 6.00],
            ['name' => 'Bicycle Rental (Per Day)', 'price' => 2.00],
            ['name' => 'Late Check-out Fee', 'price' => 5.00],
            ['name' => 'Extra Mattress Bed', 'price' => 7.00],
            ['name' => 'Extra Water Pack (6x1.5L)', 'price' => 2.50],
            ['name' => 'Traditional Khmer Massage', 'price' => 15.00],
        ])->each(fn (array $service) => Service::create($service));

        // 4. System Settings (Cambodian Commercial Baseline)
        Setting::create([
            'currency' => 'USD',
            'tax_rate' => 10,
            'default_checkin_time' => '14:00',
            'default_checkout_time' => '12:00',
            'electric_rate' => 0.25, // EDC Rate ($0.25/kWh)
            'water_rate' => 0.75,    // Standard Municipal Water ($0.75/m3)
            'late_fee' => 5.00,
            'payment_qr_url' => null,
            'payment_instruction' => 'Pay via ABA KHQR scanning or cash at the front desk.',
        ]);

        // 5. Promo Codes
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
            'code' => 'RETIRED10',
            'discount_type' => 'percent',
            'discount_value' => 10,
            'active' => false,
        ]);

        // 6. Waitlist Entries
        collect(['Sreymom', 'Vibol', 'Chenda', 'Pisach', 'Ratha', 'Malis', 'Sopheak', 'Kunthea', 'Vantha', 'Sreyneang', 'Bunthoeun', 'Channary'])
            ->each(function (string $name, int $index) {
                $stayType = $index % 3 === 0 ? 'long_stay' : 'short_stay';
                $fromDate = now()->addDays(rand(3, 30));

                WaitlistEntry::create([
                    'email' => strtolower($name).'.waitlist@example.com',
                    'phone_number' => '0'.rand(12, 99).rand(100000, 999999),
                    'stay_type' => $stayType,
                    'from_date' => $fromDate->toDateString(),
                    'to_date' => $stayType === 'short_stay' ? $fromDate->copy()->addDays(rand(1, 5))->toDateString() : null,
                    'notified_at' => rand(1, 100) <= 40 ? now()->subDays(rand(1, 10)) : null,
                ]);
            });

        // 7. Seed Reservations & Maintenance
        $this->call(ReservationSeeder::class);
        $this->call(RealisticReservationSeeder::class);
        $this->call(MaintenanceRequestSeeder::class);
    }
}
