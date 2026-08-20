<?php

use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;

test('non-guest roles are forbidden from the reservations area', function () {
  $admin = User::factory()->admin()->create();

  $response = $this->actingAs($admin)->get(route('reservations.index'));

  $response->assertForbidden();
});

test('a guest can book an available short-stay room', function () {
  $guest = User::factory()->create();
  $room = Room::factory()->create(['rental_mode' => 'short_stay']);

  $response = $this->actingAs($guest)->post(route('reservations.store'), [
    'room_id' => $room->id,
    'reservation_type' => 'short_stay',
    'check_in_date' => now()->addDays(5)->toDateString(),
    'check_out_date' => now()->addDays(8)->toDateString(),
    'num_guests' => 2,
  ]);

  $response->assertSessionHasNoErrors();

  $this->assertDatabaseHas('reservations', [
    'guest_id' => $guest->id,
    'room_id' => $room->id,
    'status' => 'pending',
  ]);
});

test('a guest can book an available long-stay room with an open-ended end date', function () {
  $guest = User::factory()->create();
  $room = Room::factory()->create(['rental_mode' => 'long_stay']);

  $response = $this->actingAs($guest)->post(route('reservations.store'), [
    'room_id' => $room->id,
    'reservation_type' => 'long_stay',
    'start_date' => now()->addDays(10)->toDateString(),
  ]);

  $response->assertSessionHasNoErrors();

  $this->assertDatabaseHas('reservations', [
    'guest_id' => $guest->id,
    'room_id' => $room->id,
    'status' => 'pending',
    'end_date' => null,
  ]);
});

test('booking a room with an overlapping active reservation is rejected', function () {
  $guest = User::factory()->create();
  $room = Room::factory()->create(['rental_mode' => 'short_stay']);

  Reservation::factory()->create([
    'room_id' => $room->id,
    'reservation_type' => 'short_stay',
    'check_in_date' => now()->addDays(5)->toDateString(),
    'check_out_date' => now()->addDays(10)->toDateString(),
    'status' => 'confirmed',
  ]);

  $response = $this->actingAs($guest)->post(route('reservations.store'), [
    'room_id' => $room->id,
    'reservation_type' => 'short_stay',
    'check_in_date' => now()->addDays(7)->toDateString(),
    'check_out_date' => now()->addDays(9)->toDateString(),
    'num_guests' => 1,
  ]);

  $response->assertSessionHasErrors('room_id');
});

test('a guest only sees their own reservations', function () {
  $guest = User::factory()->create();
  $otherGuest = User::factory()->create();

  $mine = Reservation::factory()->create(['guest_id' => $guest->id]);
  Reservation::factory()->create(['guest_id' => $otherGuest->id]);

  $response = $this->actingAs($guest)->get(route('reservations.index'));

  $response->assertInertia(fn($page) => $page
    ->where('reservations.data', fn($reservations) => count($reservations) === 1
      && $reservations[0]['id'] === $mine->id));
});

test('a guest can cancel their own pending reservation', function () {
  $guest = User::factory()->create();
  $room = Room::factory()->create(['status' => 'reserved']);
  $reservation = Reservation::factory()->create([
    'guest_id' => $guest->id,
    'room_id' => $room->id,
    'status' => 'confirmed',
  ]);

  $response = $this->actingAs($guest)->patch(route('reservations.cancel', $reservation));

  $response->assertSessionHasNoErrors();
  expect($reservation->fresh()->status)->toBe('cancelled');
  expect($room->fresh()->status)->toBe('available');
});

test('a guest cannot cancel someone else\'s reservation', function () {
  $guest = User::factory()->create();
  $otherGuest = User::factory()->create();
  $reservation = Reservation::factory()->create(['guest_id' => $otherGuest->id]);

  $response = $this->actingAs($guest)->patch(route('reservations.cancel', $reservation));

  $response->assertForbidden();
});
