<?php

use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;

test('guests are forbidden from the staff reservations area', function () {
    $guest = User::factory()->create();

    $response = $this->actingAs($guest)->get(route('staff.reservations.index'));

    $response->assertForbidden();
});

test('housekeeping is forbidden from the staff reservations area', function () {
    $housekeeping = User::factory()->housekeeping()->create();

    $response = $this->actingAs($housekeeping)->get(route('staff.reservations.index'));

    $response->assertForbidden();
});

test('receptionist can view all reservations', function () {
    $receptionist = User::factory()->receptionist()->create();
    Reservation::factory(3)->create();

    $response = $this->actingAs($receptionist)->get(route('staff.reservations.index'));

    $response->assertOk();
});

test('receptionist can create a walk-in booking for an existing guest', function () {
    $receptionist = User::factory()->receptionist()->create();
    $guest = User::factory()->create();
    $room = Room::factory()->create(['rental_mode' => 'short_stay', 'status' => 'available']);

    $response = $this->actingAs($receptionist)->post(route('staff.reservations.store'), [
        'room_id' => $room->id,
        'guest_id' => $guest->id,
        'reservation_type' => 'short_stay',
        'check_in_date' => now()->addDay()->toDateString(),
        'check_out_date' => now()->addDays(3)->toDateString(),
        'num_guests' => 1,
    ]);

    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('reservations', [
        'guest_id' => $guest->id,
        'room_id' => $room->id,
        'status' => 'confirmed',
    ]);
    expect($room->fresh()->status)->toBe('reserved');
});

test('receptionist can create a walk-in booking for a brand new guest', function () {
    $receptionist = User::factory()->receptionist()->create();
    $room = Room::factory()->create(['rental_mode' => 'long_stay', 'status' => 'available']);

    $response = $this->actingAs($receptionist)->post(route('staff.reservations.store'), [
        'room_id' => $room->id,
        'new_guest' => [
            'full_name' => 'Walk-in Guest',
            'email' => 'walkin@example.com',
        ],
        'reservation_type' => 'long_stay',
        'start_date' => now()->addDay()->toDateString(),
    ]);

    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('users', [
        'email' => 'walkin@example.com',
        'role' => 'guest',
    ]);
    $this->assertDatabaseHas('reservations', [
        'room_id' => $room->id,
        'status' => 'active',
    ]);
    expect($room->fresh()->status)->toBe('occupied');
});

test('confirming a pending short-stay reservation reserves the room', function () {
    $receptionist = User::factory()->receptionist()->create();
    $room = Room::factory()->create(['status' => 'available']);
    $reservation = Reservation::factory()->create([
        'room_id' => $room->id,
        'reservation_type' => 'short_stay',
        'status' => 'pending',
    ]);

    $response = $this->actingAs($receptionist)->patch(route('staff.reservations.confirm', $reservation));

    $response->assertSessionHasNoErrors();
    expect($reservation->fresh()->status)->toBe('confirmed');
    expect($room->fresh()->status)->toBe('reserved');
});

test('confirming a pending long-stay reservation occupies the room immediately', function () {
    $receptionist = User::factory()->receptionist()->create();
    $room = Room::factory()->create(['status' => 'available']);
    $reservation = Reservation::factory()->longStay()->create([
        'room_id' => $room->id,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($receptionist)->patch(route('staff.reservations.confirm', $reservation));

    $response->assertSessionHasNoErrors();
    expect($reservation->fresh()->status)->toBe('active');
    expect($room->fresh()->status)->toBe('occupied');
});

test('a confirmed short-stay reservation can be checked in and out', function () {
    $receptionist = User::factory()->receptionist()->create();
    $room = Room::factory()->create(['status' => 'reserved']);
    $reservation = Reservation::factory()->create([
        'room_id' => $room->id,
        'reservation_type' => 'short_stay',
        'status' => 'confirmed',
    ]);

    $this->actingAs($receptionist)
        ->patch(route('staff.reservations.check-in', $reservation))
        ->assertSessionHasNoErrors();

    expect($reservation->fresh()->status)->toBe('checked_in');
    expect($room->fresh()->status)->toBe('occupied');

    $this->actingAs($receptionist)
        ->patch(route('staff.reservations.check-out', $reservation))
        ->assertSessionHasNoErrors();

    expect($reservation->fresh()->status)->toBe('checked_out');
    expect($room->fresh()->status)->toBe('cleaning');
});

test('staff can cancel any reservation', function () {
    $receptionist = User::factory()->receptionist()->create();
    $room = Room::factory()->create(['status' => 'occupied']);
    $reservation = Reservation::factory()->longStay()->create([
        'room_id' => $room->id,
        'status' => 'active',
    ]);

    $response = $this->actingAs($receptionist)->patch(route('staff.reservations.cancel', $reservation));

    $response->assertSessionHasNoErrors();
    expect($reservation->fresh()->status)->toBe('cancelled');
    expect($room->fresh()->status)->toBe('available');
});
