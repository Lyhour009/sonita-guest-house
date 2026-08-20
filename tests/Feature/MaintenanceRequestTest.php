<?php

use App\Models\MaintenanceRequest;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;

test('a guest can submit a maintenance request for a room they have stayed in', function () {
    $guest = User::factory()->create();
    $room = Room::factory()->create(['status' => 'available']);
    Reservation::factory()->create(['guest_id' => $guest->id, 'room_id' => $room->id]);

    $response = $this->actingAs($guest)->post(route('maintenance.store'), [
        'room_id' => $room->id,
        'title' => 'Broken air conditioner',
        'description' => 'The AC is not cooling.',
        'priority' => 'high',
    ]);

    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('maintenance_requests', [
        'reporter_id' => $guest->id,
        'room_id' => $room->id,
        'title' => 'Broken air conditioner',
        'priority' => 'high',
        'status' => 'pending',
    ]);
});

test('submitting a request on an available room flips the room to maintenance', function () {
    $guest = User::factory()->create();
    $room = Room::factory()->create(['status' => 'available']);

    $this->actingAs($guest)->post(route('maintenance.store'), [
        'room_id' => $room->id,
        'title' => 'Leaking sink',
        'priority' => 'medium',
    ]);

    expect($room->fresh()->status)->toBe('maintenance');
});

test('submitting a request on an occupied room does not change the room status', function () {
    $guest = User::factory()->create();
    $room = Room::factory()->create(['status' => 'occupied']);

    $this->actingAs($guest)->post(route('maintenance.store'), [
        'room_id' => $room->id,
        'title' => 'Noisy neighbor',
        'priority' => 'low',
    ]);

    expect($room->fresh()->status)->toBe('occupied');
});

test('a guest only sees their own maintenance requests', function () {
    $guest = User::factory()->create();
    $otherGuest = User::factory()->create();

    $mine = MaintenanceRequest::factory()->create(['reporter_id' => $guest->id]);
    MaintenanceRequest::factory()->create(['reporter_id' => $otherGuest->id]);

    $response = $this->actingAs($guest)->get(route('maintenance.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('requests.data', fn ($requests) => count($requests) === 1
            && $requests[0]['id'] === $mine->id));
});
