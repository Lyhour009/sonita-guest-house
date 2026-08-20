<?php

use App\Models\Service;
use App\Models\User;

test('non-admin is forbidden from managing services', function () {
    $receptionist = User::factory()->receptionist()->create();

    $response = $this->actingAs($receptionist)->get(route('admin.services.index'));

    $response->assertForbidden();
});

test('admin can create a service', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.services.store'), [
        'name' => 'Breakfast',
        'price' => 5.5,
    ]);

    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('services', [
        'name' => 'Breakfast',
        'price' => '5.50',
    ]);
});

test('creating a service requires a name and a non-negative price', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.services.store'), [
        'name' => '',
        'price' => -1,
    ]);

    $response->assertSessionHasErrors(['name', 'price']);
});

test('admin can update a service', function () {
    $admin = User::factory()->admin()->create();
    $service = Service::factory()->create(['name' => 'Laundry', 'price' => 10]);

    $response = $this->actingAs($admin)->patch(route('admin.services.update', $service), [
        'name' => 'Laundry Service',
        'price' => 12,
    ]);

    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('services', [
        'id' => $service->id,
        'name' => 'Laundry Service',
        'price' => '12.00',
    ]);
});

test('admin can delete a service', function () {
    $admin = User::factory()->admin()->create();
    $service = Service::factory()->create();

    $response = $this->actingAs($admin)->delete(route('admin.services.destroy', $service));

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseMissing('services', ['id' => $service->id]);
});

test('the services index is paginated', function () {
    $admin = User::factory()->admin()->create();
    Service::factory()->count(12)->create();

    $response = $this->actingAs($admin)->get(route('admin.services.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('services.data', fn ($services) => count($services) === 10)
        ->where('services.total', 12));
});
