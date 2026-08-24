<?php

use App\Models\ActivityLog;
use App\Models\User;

test('non-admin is forbidden from the activity log page', function () {
    $receptionist = User::factory()->receptionist()->create();

    $response = $this->actingAs($receptionist)->get(route('admin.activity-log.index'));

    $response->assertForbidden();
});

test('admin can view the activity log', function () {
    $admin = User::factory()->admin()->create();
    ActivityLog::factory(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.activity-log.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->has('logs.data', 3));
});

test('admin can filter the activity log by action', function () {
    $admin = User::factory()->admin()->create();
    ActivityLog::factory()->create(['action' => 'room.created']);
    ActivityLog::factory()->create(['action' => 'staff.created']);

    $response = $this->actingAs($admin)->get(route('admin.activity-log.index', ['action' => 'room.created']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('logs.data', fn ($logs) => count($logs) === 1 && $logs[0]['action'] === 'room.created'));
});
