<?php

use App\Models\Reservation;
use App\Models\Room;
use App\Models\Setting;
use App\Models\User;

beforeEach(function () {
    Setting::create([
        'currency' => 'USD',
        'tax_rate' => 10,
        'electric_rate' => 0.25,
        'water_rate' => 0.15,
        'late_fee' => 5,
    ]);
});

test('checking out a short-stay reservation auto-generates a correct invoice', function () {
    $receptionist = User::factory()->receptionist()->create();
    $room = Room::factory()->create(['price_per_night' => 50, 'status' => 'occupied']);
    $reservation = Reservation::factory()->create([
        'room_id' => $room->id,
        'reservation_type' => 'short_stay',
        'check_in_date' => now()->subDays(3)->toDateString(),
        'check_out_date' => now()->toDateString(),
        'status' => 'checked_in',
    ]);

    $this->actingAs($receptionist)
        ->patch(route('staff.reservations.check-out', $reservation))
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('invoices', [
        'reservation_id' => $reservation->id,
        'invoice_type' => 'short_stay',
        'room_charge' => '150.00',
        'service_charge' => '0.00',
        'tax_amount' => '15.00',
        'total_amount' => '165.00',
        'status' => 'unpaid',
    ]);
});

test('admin can generate a long-stay invoice with correct utility charges', function () {
    $admin = User::factory()->admin()->create();
    $room = Room::factory()->create(['price_per_month' => 400]);
    $reservation = Reservation::factory()->longStay()->create([
        'room_id' => $room->id,
        'status' => 'active',
        'monthly_due_day' => 5,
    ]);

    $response = $this->actingAs($admin)->post(route('admin.invoices.store'), [
        'reservation_id' => $reservation->id,
        'elec_meter_start' => 100,
        'elec_meter_end' => 150,
        'water_meter_start' => 20,
        'water_meter_end' => 30,
    ]);

    $response->assertSessionHasNoErrors();

    // utility = (150-100)*0.25 + (30-20)*0.15 = 12.5 + 1.5 = 14
    // tax = (400 + 0 + 14) * 10% = 41.4
    // total = 400 + 0 + 14 + 41.4 = 455.4
    $this->assertDatabaseHas('invoices', [
        'reservation_id' => $reservation->id,
        'invoice_type' => 'long_stay',
        'room_charge' => '400.00',
        'utility_charge' => '14.00',
        'tax_amount' => '41.40',
        'total_amount' => '455.40',
        'status' => 'unpaid',
    ]);
});

test('non-admin cannot generate long-stay invoices', function () {
    $receptionist = User::factory()->receptionist()->create();
    $reservation = Reservation::factory()->longStay()->create(['status' => 'active']);

    $response = $this->actingAs($receptionist)->post(route('admin.invoices.store'), [
        'reservation_id' => $reservation->id,
        'elec_meter_start' => 0,
        'elec_meter_end' => 10,
        'water_meter_start' => 0,
        'water_meter_end' => 10,
    ]);

    $response->assertForbidden();
});

test('a pending long-stay reservation cannot be invoiced yet', function () {
    $admin = User::factory()->admin()->create();
    $reservation = Reservation::factory()->longStay()->create(['status' => 'pending']);

    $response = $this->actingAs($admin)->post(route('admin.invoices.store'), [
        'reservation_id' => $reservation->id,
        'elec_meter_start' => 0,
        'elec_meter_end' => 10,
        'water_meter_start' => 0,
        'water_meter_end' => 10,
    ]);

    $response->assertSessionHasErrors('reservation_id');
});
