<?php

use App\Models\PromoCode;
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

test('a valid percent promo code discounts a short-stay invoice before tax', function () {
    $receptionist = User::factory()->receptionist()->create();
    PromoCode::factory()->create(['code' => 'SAVE20', 'discount_type' => 'percent', 'discount_value' => 20]);
    $room = Room::factory()->create(['price_per_night' => 50, 'status' => 'occupied']);
    $reservation = Reservation::factory()->create([
        'room_id' => $room->id,
        'reservation_type' => 'short_stay',
        'check_in_date' => now()->subDays(3)->toDateString(),
        'check_out_date' => now()->toDateString(),
        'status' => 'checked_in',
        'promo_code' => 'save20',
    ]);

    $this->actingAs($receptionist)
        ->patch(route('staff.reservations.check-out', $reservation))
        ->assertSessionHasNoErrors();

    // subtotal 150, discount 20% = 30, taxable 120, tax 10% = 12, total = 132
    $this->assertDatabaseHas('invoices', [
        'reservation_id' => $reservation->id,
        'room_charge' => '150.00',
        'discount_amount' => '30.00',
        'tax_amount' => '12.00',
        'total_amount' => '132.00',
    ]);
    $this->assertDatabaseHas('promo_codes', ['code' => 'SAVE20', 'used_count' => 1]);
});

test('a valid fixed promo code discounts a long-stay invoice before tax', function () {
    $admin = User::factory()->admin()->create();
    PromoCode::factory()->create(['code' => 'FLAT50', 'discount_type' => 'fixed', 'discount_value' => 50]);
    $room = Room::factory()->create(['price_per_month' => 400]);
    $reservation = Reservation::factory()->longStay()->create([
        'room_id' => $room->id,
        'status' => 'active',
        'promo_code' => 'FLAT50',
    ]);

    $response = $this->actingAs($admin)->post(route('admin.invoices.store'), [
        'reservation_id' => $reservation->id,
        'elec_meter_start' => 0,
        'elec_meter_end' => 0,
        'water_meter_start' => 0,
        'water_meter_end' => 0,
    ]);

    $response->assertSessionHasNoErrors();

    // subtotal 400, discount 50, taxable 350, tax 10% = 35, total = 385
    $this->assertDatabaseHas('invoices', [
        'reservation_id' => $reservation->id,
        'room_charge' => '400.00',
        'discount_amount' => '50.00',
        'tax_amount' => '35.00',
        'total_amount' => '385.00',
    ]);
});

test('an expired promo code is ignored and the booking still succeeds', function () {
    $receptionist = User::factory()->receptionist()->create();
    PromoCode::factory()->expired()->create(['code' => 'EXPIRED10', 'discount_value' => 10]);
    $room = Room::factory()->create(['price_per_night' => 50, 'status' => 'occupied']);
    $reservation = Reservation::factory()->create([
        'room_id' => $room->id,
        'reservation_type' => 'short_stay',
        'check_in_date' => now()->subDays(2)->toDateString(),
        'check_out_date' => now()->toDateString(),
        'status' => 'checked_in',
        'promo_code' => 'EXPIRED10',
    ]);

    $this->actingAs($receptionist)
        ->patch(route('staff.reservations.check-out', $reservation))
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('invoices', [
        'reservation_id' => $reservation->id,
        'discount_amount' => '0.00',
        'total_amount' => '110.00',
    ]);
});

test('an inactive promo code is ignored', function () {
    $receptionist = User::factory()->receptionist()->create();
    PromoCode::factory()->inactive()->create(['code' => 'OFF10', 'discount_value' => 10]);
    $room = Room::factory()->create(['price_per_night' => 50, 'status' => 'occupied']);
    $reservation = Reservation::factory()->create([
        'room_id' => $room->id,
        'reservation_type' => 'short_stay',
        'check_in_date' => now()->subDays(1)->toDateString(),
        'check_out_date' => now()->toDateString(),
        'status' => 'checked_in',
        'promo_code' => 'OFF10',
    ]);

    $this->actingAs($receptionist)
        ->patch(route('staff.reservations.check-out', $reservation))
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('invoices', [
        'reservation_id' => $reservation->id,
        'discount_amount' => '0.00',
    ]);
});

test('a promo code that already hit its max uses is ignored', function () {
    $receptionist = User::factory()->receptionist()->create();
    PromoCode::factory()->create(['code' => 'LIMITED', 'discount_value' => 10, 'max_uses' => 1, 'used_count' => 1]);
    $room = Room::factory()->create(['price_per_night' => 50, 'status' => 'occupied']);
    $reservation = Reservation::factory()->create([
        'room_id' => $room->id,
        'reservation_type' => 'short_stay',
        'check_in_date' => now()->subDays(1)->toDateString(),
        'check_out_date' => now()->toDateString(),
        'status' => 'checked_in',
        'promo_code' => 'LIMITED',
    ]);

    $this->actingAs($receptionist)
        ->patch(route('staff.reservations.check-out', $reservation))
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('invoices', [
        'reservation_id' => $reservation->id,
        'discount_amount' => '0.00',
    ]);
});

test('the discount can never exceed the pre-tax subtotal', function () {
    $receptionist = User::factory()->receptionist()->create();
    PromoCode::factory()->create(['code' => 'HUGE', 'discount_type' => 'fixed', 'discount_value' => 500]);
    $room = Room::factory()->create(['price_per_night' => 50, 'status' => 'occupied']);
    $reservation = Reservation::factory()->create([
        'room_id' => $room->id,
        'reservation_type' => 'short_stay',
        'check_in_date' => now()->subDays(1)->toDateString(),
        'check_out_date' => now()->toDateString(),
        'status' => 'checked_in',
        'promo_code' => 'HUGE',
    ]);

    $this->actingAs($receptionist)
        ->patch(route('staff.reservations.check-out', $reservation))
        ->assertSessionHasNoErrors();

    // subtotal is 50, discount is capped at 50, taxable 0, tax 0, total 0
    $this->assertDatabaseHas('invoices', [
        'reservation_id' => $reservation->id,
        'discount_amount' => '50.00',
        'tax_amount' => '0.00',
        'total_amount' => '0.00',
    ]);
});
