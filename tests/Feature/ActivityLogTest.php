<?php

use App\Models\ActivityLog;
use App\Models\Room;
use App\Models\User;

test('creating a room records an activity log entry', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('admin.rooms.store'), [
        'room_number' => '101',
        'room_type' => 'Standard',
        'rental_mode' => 'both',
        'price_per_night' => 25,
        'price_per_month' => 400,
        'status' => 'available',
        'floor' => 1,
        'max_occupants' => 2,
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'causer_id' => $admin->id,
        'action' => 'room.created',
    ]);
});

test('updating a room records an activity log entry', function () {
    $admin = User::factory()->admin()->create();
    $room = Room::factory()->create(['room_number' => '202']);

    $this->actingAs($admin)->put(route('admin.rooms.update', $room), [
        'room_number' => '303',
        'room_type' => $room->room_type,
        'rental_mode' => $room->rental_mode,
        'price_per_night' => $room->price_per_night,
        'price_per_month' => $room->price_per_month,
        'status' => $room->status,
        'floor' => $room->floor,
        'max_occupants' => $room->max_occupants,
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'causer_id' => $admin->id,
        'action' => 'room.updated',
        'subject_id' => $room->id,
    ]);
});

test('deleting a room records an activity log entry', function () {
    $admin = User::factory()->admin()->create();
    $room = Room::factory()->create();

    $this->actingAs($admin)->delete(route('admin.rooms.destroy', $room));

    $this->assertDatabaseHas('activity_logs', [
        'causer_id' => $admin->id,
        'action' => 'room.deleted',
        'subject_id' => $room->id,
    ]);
});

test('a system-triggered log entry has no causer', function () {
    $log = ActivityLog::factory()->create(['causer_id' => null]);

    expect($log->causer)->toBeNull();
});
