<?php

namespace Database\Seeders;

use App\Actions\Invoices\GenerateLongStayInvoice;
use App\Actions\Maintenance\AssignMaintenanceRequest;
use App\Actions\Maintenance\SubmitMaintenanceRequest;
use App\Actions\Maintenance\UpdateMaintenanceRequestStatus;
use App\Actions\Payments\ConfirmPayment;
use App\Actions\Payments\SubmitPayment;
use App\Actions\Reservations\CheckInReservation;
use App\Actions\Reservations\CheckOutReservation;
use App\Actions\Reservations\ConfirmReservation;
use App\Actions\Reservations\CreateGuestReservation;
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
   * Seed the application's database with a realistic, internally consistent demo dataset.
   *
   * Reservation/payment/maintenance state is produced by driving the same Action classes
   * the real app uses, rather than hand-writing rows, so room statuses, invoice totals,
   * and notifications stay consistent with production behaviour.
   */
  public function run(): void
  {
    $admin = User::factory()->admin()->create([
      'full_name' => 'Admin Hour',
      'email' => 'admin@example.com',
    ]);

    $receptionist = User::factory()->receptionist()->create([
      'full_name' => 'Receptionist Staff',
      'email' => 'receptionist@example.com',
    ]);

    $housekeeper = User::factory()->housekeeping()->create([
      'full_name' => 'Housekeeping Staff',
      'email' => 'housekeeping@example.com',
    ]);

    $mainGuest = User::factory()->create([
      'full_name' => 'Demo Guest',
      'email' => 'guest@example.com',
    ]);

    $otherGuests = User::factory(2)->create();
    User::factory(2)->create();

    // Call Room Seeder
    $this->call(RoomSeeder::class);

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

    // Call Reservation Seeder for 50 realistic reservations
    $this->call(ReservationSeeder::class);

    $submitMaintenanceRequest = app(SubmitMaintenanceRequest::class);
    $assignMaintenanceRequest = app(AssignMaintenanceRequest::class);
    $updateMaintenanceRequestStatus = app(UpdateMaintenanceRequestStatus::class);

    // Maintenance: create a few maintenance requests on random rooms
    $rooms = Room::all();
    if ($rooms->isNotEmpty()) {
      $maintenanceRoom1 = $rooms->random();
      $submitMaintenanceRequest->handle($mainGuest, [
        'room_id' => $maintenanceRoom1->id,
        'title' => 'Air conditioner not cooling',
        'description' => 'The AC in the room blows warm air.',
        'priority' => 'high',
      ]);

      $maintenanceRoom2 = $rooms->random();
      $maintenance2 = $submitMaintenanceRequest->handle($otherGuests[0], [
        'room_id' => $maintenanceRoom2->id,
        'title' => 'Leaking bathroom faucet',
        'priority' => 'medium',
      ]);
      $assignMaintenanceRequest->handle($maintenance2, $housekeeper);
      $updateMaintenanceRequestStatus->handle($maintenance2, 'in_progress');

      $maintenanceRoom3 = $rooms->random();
      $maintenance3 = $submitMaintenanceRequest->handle($receptionist, [
        'room_id' => $maintenanceRoom3->id,
        'title' => 'Light bulb replacement',
        'priority' => 'low',
      ]);
      $assignMaintenanceRequest->handle($maintenance3, $housekeeper);
      $updateMaintenanceRequestStatus->handle($maintenance3, 'in_progress');
      $updateMaintenanceRequestStatus->handle($maintenance3, 'resolved');
    }
  }
}
