<?php

use App\Models\Room;
use App\Models\User;

test('guests are forbidden from the housekeeping area', function () {
    $guest = User::factory()->create();

    $response = $this->actingAs($guest)->get(route('staff.housekeeping.index'));

    $response->assertForbidden();
});

test('receptionist is forbidden from the housekeeping area', function () {
    $receptionist = User::factory()->receptionist()->create();

    $response = $this->actingAs($receptionist)->get(route('staff.housekeeping.index'));

    $response->assertForbidden();
});

test('housekeeping only sees rooms currently awaiting cleaning', function () {
    $housekeeper = User::factory()->housekeeping()->create();
    $cleaningRoom = Room::factory()->create(['status' => 'cleaning']);
    Room::factory()->create(['status' => 'available']);

    $response = $this->actingAs($housekeeper)->get(route('staff.housekeeping.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('rooms', fn ($rooms) => count($rooms) === 1
            && $rooms[0]['id'] === $cleaningRoom->id));
});

test('housekeeping can mark a cleaning room as available', function () {
    $housekeeper = User::factory()->housekeeping()->create();
    $room = Room::factory()->create(['status' => 'cleaning']);

    $response = $this->actingAs($housekeeper)->patch(route('staff.housekeeping.clean', $room));

    $response->assertSessionHasNoErrors();
    expect($room->fresh()->status)->toBe('available');
});

test('a room not awaiting cleaning cannot be marked clean', function () {
    $admin = User::factory()->admin()->create();
    $room = Room::factory()->create(['status' => 'available']);

    $response = $this->actingAs($admin)->patch(route('staff.housekeeping.clean', $room));

    $response->assertSessionHasErrors('status');
    expect($room->fresh()->status)->toBe('available');
});
