<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\Service;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
  use WithoutModelEvents;

  /**
   * Seed the application's database.
   */
  public function run(): void
  {
    User::factory()->admin()->create([
      'full_name' => 'Admin Hour',
      'email' => 'admin@example.com',
    ]);

    User::factory()->receptionist()->create([
      'full_name' => 'Receptionist Staff',
      'email' => 'receptionist@sonita.com',
    ]);

    User::factory()->housekeeping()->create([
      'full_name' => 'Housekeeping Staff',
      'email' => 'housekeeping@sonita.com',
    ]);

    User::factory(3)->create();

    Room::factory(3)->create(['rental_mode' => 'short_stay']);
    Room::factory(3)->create(['rental_mode' => 'long_stay']);
    Room::factory(2)->create(['rental_mode' => 'both']);

    collect(['Breakfast', 'Laundry', 'Airport Pickup'])->each(
      fn(string $name) => Service::factory()->create(['name' => $name]),
    );

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
  }
}
