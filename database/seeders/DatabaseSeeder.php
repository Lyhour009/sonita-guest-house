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

    $shortStayRooms = Room::factory(3)->create(['rental_mode' => 'short_stay']);
    $longStayRooms = Room::factory(3)->create(['rental_mode' => 'long_stay']);
    $bothRooms = Room::factory(2)->create(['rental_mode' => 'both']);

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

    $createGuestReservation = app(CreateGuestReservation::class);
    $confirmReservation = app(ConfirmReservation::class);
    $checkInReservation = app(CheckInReservation::class);
    $checkOutReservation = app(CheckOutReservation::class);
    $generateLongStayInvoice = app(GenerateLongStayInvoice::class);
    $submitPayment = app(SubmitPayment::class);
    $confirmPayment = app(ConfirmPayment::class);
    $submitMaintenanceRequest = app(SubmitMaintenanceRequest::class);
    $assignMaintenanceRequest = app(AssignMaintenanceRequest::class);
    $updateMaintenanceRequestStatus = app(UpdateMaintenanceRequestStatus::class);

    // Reservation 1: full short-stay lifecycle through checkout, with a partially paid invoice.
    // Leaves its room in "cleaning" so the housekeeping board has something to show.
    $reservation1 = $createGuestReservation->handle($mainGuest, [
      'room_id' => $shortStayRooms[0]->id,
      'reservation_type' => 'short_stay',
      'check_in_date' => now()->subDays(3)->toDateString(),
      'check_out_date' => now()->toDateString(),
      'num_guests' => 2,
    ]);
    $confirmReservation->handle($reservation1);
    $checkInReservation->handle($reservation1);
    $reservation1 = $checkOutReservation->handle($reservation1);
    $invoice1 = $reservation1->invoices()->latest()->first();
    $payment1 = $submitPayment->handle($mainGuest, $invoice1, [
      'amount' => round((float) $invoice1->total_amount / 2, 2),
      'method' => 'cash',
    ]);
    $confirmPayment->handle($payment1);

    // Reservation 2: active long-stay tenancy with a fully paid admin-generated invoice.
    $reservation2 = $createGuestReservation->handle($otherGuests[0], [
      'room_id' => $longStayRooms[0]->id,
      'reservation_type' => 'long_stay',
      'start_date' => now()->subMonth()->toDateString(),
      'monthly_due_day' => 5,
    ]);
    $confirmReservation->handle($reservation2);
    $invoice2 = $generateLongStayInvoice->handle($reservation2, [
      'elec_meter_start' => 100,
      'elec_meter_end' => 140,
      'water_meter_start' => 20,
      'water_meter_end' => 28,
    ]);
    $payment2 = $submitPayment->handle($otherGuests[0], $invoice2, [
      'amount' => $invoice2->total_amount,
      'method' => 'bank_transfer',
    ]);
    $confirmPayment->handle($payment2);

    // Reservation 3: confirmed, checking in today — shows up as a receptionist "arrival".
    $reservation3 = $createGuestReservation->handle($otherGuests[1], [
      'room_id' => $shortStayRooms[1]->id,
      'reservation_type' => 'short_stay',
      'check_in_date' => now()->toDateString(),
      'check_out_date' => now()->addDays(2)->toDateString(),
      'num_guests' => 1,
    ]);
    $confirmReservation->handle($reservation3);

    // Reservation 4: checked in, checking out today — shows up as a receptionist "departure".
    $reservation4 = $createGuestReservation->handle($mainGuest, [
      'room_id' => $shortStayRooms[2]->id,
      'reservation_type' => 'short_stay',
      'check_in_date' => now()->subDays(2)->toDateString(),
      'check_out_date' => now()->toDateString(),
      'num_guests' => 1,
    ]);
    $confirmReservation->handle($reservation4);
    $checkInReservation->handle($reservation4);

    // Reservation 5: left pending, to demo the receptionist's "confirm" action.
    $createGuestReservation->handle($otherGuests[0], [
      'room_id' => $bothRooms[0]->id,
      'reservation_type' => 'short_stay',
      'check_in_date' => now()->addDays(5)->toDateString(),
      'check_out_date' => now()->addDays(8)->toDateString(),
      'num_guests' => 2,
    ]);

    // Maintenance: one unassigned, one in progress, one resolved (its room reverts to available).
    $submitMaintenanceRequest->handle($mainGuest, [
      'room_id' => $longStayRooms[1]->id,
      'title' => 'Air conditioner not cooling',
      'description' => 'The AC in the room blows warm air.',
      'priority' => 'high',
    ]);

    $maintenance2 = $submitMaintenanceRequest->handle($otherGuests[1], [
      'room_id' => $longStayRooms[2]->id,
      'title' => 'Leaking bathroom faucet',
      'priority' => 'medium',
    ]);
    $assignMaintenanceRequest->handle($maintenance2, $housekeeper);
    $updateMaintenanceRequestStatus->handle($maintenance2, 'in_progress');

    $maintenance3 = $submitMaintenanceRequest->handle($receptionist, [
      'room_id' => $bothRooms[1]->id,
      'title' => 'Light bulb replacement',
      'priority' => 'low',
    ]);
    $assignMaintenanceRequest->handle($maintenance3, $housekeeper);
    $updateMaintenanceRequestStatus->handle($maintenance3, 'in_progress');
    $updateMaintenanceRequestStatus->handle($maintenance3, 'resolved');
  }
}
