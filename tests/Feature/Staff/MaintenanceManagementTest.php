<?php

use App\Models\MaintenanceRequest;
use App\Models\Room;
use App\Models\User;

test('guests are forbidden from the staff maintenance area', function () {
    $guest = User::factory()->create();

    $response = $this->actingAs($guest)->get(route('staff.maintenance.index'));

    $response->assertForbidden();
});

test('receptionist is forbidden from the staff maintenance area', function () {
    $receptionist = User::factory()->receptionist()->create();

    $response = $this->actingAs($receptionist)->get(route('staff.maintenance.index'));

    $response->assertForbidden();
});

test('admin can assign a request to a housekeeping user', function () {
    $admin = User::factory()->admin()->create();
    $housekeeper = User::factory()->housekeeping()->create();
    $request = MaintenanceRequest::factory()->create();

    $response = $this->actingAs($admin)->patch(route('staff.maintenance.assign', $request), [
        'assigned_to' => $housekeeper->id,
    ]);

    $response->assertSessionHasNoErrors();
    expect($request->fresh()->assigned_to)->toBe($housekeeper->id);
});

test('admin cannot assign a request to a non-housekeeping user', function () {
    $admin = User::factory()->admin()->create();
    $receptionist = User::factory()->receptionist()->create();
    $request = MaintenanceRequest::factory()->create();

    $response = $this->actingAs($admin)->patch(route('staff.maintenance.assign', $request), [
        'assigned_to' => $receptionist->id,
    ]);

    $response->assertSessionHasErrors('assigned_to');
});

test('housekeeping only sees requests assigned to them', function () {
    $housekeeper = User::factory()->housekeeping()->create();
    $otherHousekeeper = User::factory()->housekeeping()->create();

    $mine = MaintenanceRequest::factory()->create(['assigned_to' => $housekeeper->id]);
    MaintenanceRequest::factory()->create(['assigned_to' => $otherHousekeeper->id]);

    $response = $this->actingAs($housekeeper)->get(route('staff.maintenance.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('requests.data', fn ($requests) => count($requests) === 1
            && $requests[0]['id'] === $mine->id));
});

test('housekeeping can resolve an assigned request and the room reverts to available', function () {
    $housekeeper = User::factory()->housekeeping()->create();
    $room = Room::factory()->create(['status' => 'maintenance']);
    $request = MaintenanceRequest::factory()->create([
        'room_id' => $room->id,
        'assigned_to' => $housekeeper->id,
        'status' => 'in_progress',
    ]);

    $response = $this->actingAs($housekeeper)->patch(route('staff.maintenance.status', $request), [
        'status' => 'resolved',
    ]);

    $response->assertSessionHasNoErrors();
    expect($request->fresh()->status)->toBe('resolved');
    expect($request->fresh()->resolved_at)->not->toBeNull();
    expect($room->fresh()->status)->toBe('available');
});

test('resolving a request does not touch a room that was never auto-flipped to maintenance', function () {
    $housekeeper = User::factory()->housekeeping()->create();
    $room = Room::factory()->create(['status' => 'occupied']);
    $request = MaintenanceRequest::factory()->create([
        'room_id' => $room->id,
        'assigned_to' => $housekeeper->id,
        'status' => 'in_progress',
    ]);

    $this->actingAs($housekeeper)->patch(route('staff.maintenance.status', $request), [
        'status' => 'resolved',
    ]);

    expect($room->fresh()->status)->toBe('occupied');
});

test('a closed request cannot be reassigned or transitioned again', function () {
    $admin = User::factory()->admin()->create();
    $housekeeper = User::factory()->housekeeping()->create();
    $request = MaintenanceRequest::factory()->resolved()->create();

    $assignResponse = $this->actingAs($admin)->patch(route('staff.maintenance.assign', $request), [
        'assigned_to' => $housekeeper->id,
    ]);
    $assignResponse->assertSessionHasErrors('assigned_to');

    $statusResponse = $this->actingAs($housekeeper)->patch(route('staff.maintenance.status', $request), [
        'status' => 'in_progress',
    ]);
    $statusResponse->assertSessionHasErrors('status');
});
