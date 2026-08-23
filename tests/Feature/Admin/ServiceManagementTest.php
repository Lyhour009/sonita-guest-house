<?php

use App\Models\Reservation;
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

test('deleting a service that is attached to a reservation is blocked instead of crashing', function () {
    $admin = User::factory()->admin()->create();
    $service = Service::factory()->create();
    $reservation = Reservation::factory()->create();
    $reservation->services()->attach($service->id, ['quantity' => 1, 'unit_price' => $service->price]);

    $response = $this->actingAs($admin)->delete(route('admin.services.destroy', $service));

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('services', ['id' => $service->id]);
});

test('the services index is paginated', function () {
    $admin = User::factory()->admin()->create();
    Service::factory()->count(12)->create();

    $response = $this->actingAs($admin)->get(route('admin.services.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('services.data', fn ($services) => count($services) === 10)
        ->where('services.total', 12));
});

test('the services index can be searched by name', function () {
    $admin = User::factory()->admin()->create();
    $match = Service::factory()->create(['name' => 'Airport Pickup']);
    $other = Service::factory()->create(['name' => 'Laundry']);

    $response = $this->actingAs($admin)->get(route('admin.services.index', ['search' => 'Airport']));

    $response->assertInertia(fn ($page) => $page
        ->where('services.data', function ($services) use ($match, $other) {
            $ids = collect($services)->pluck('id');

            return $ids->contains($match->id) && ! $ids->contains($other->id);
        }));
});

test('the services index can be filtered by usage', function () {
    $admin = User::factory()->admin()->create();
    $used = Service::factory()->create();
    $unused = Service::factory()->create();
    $reservation = Reservation::factory()->create();
    $reservation->services()->attach($used->id, ['quantity' => 1, 'unit_price' => $used->price]);

    $response = $this->actingAs($admin)->get(route('admin.services.index', ['usage' => 'unused']));

    $response->assertInertia(fn ($page) => $page
        ->where('services.data', function ($services) use ($used, $unused) {
            $ids = collect($services)->pluck('id');

            return $ids->contains($unused->id) && ! $ids->contains($used->id);
        }));
});

test('usage count and revenue are computed correctly', function () {
    $admin = User::factory()->admin()->create();
    $service = Service::factory()->create(['price' => 10]);
    $reservation = Reservation::factory()->create();
    $reservation->services()->attach($service->id, ['quantity' => 2, 'unit_price' => 10]);

    $response = $this->actingAs($admin)->get(route('admin.services.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('services.data', function ($services) use ($service) {
            $row = collect($services)->firstWhere('id', $service->id);

            return $row['usage_count'] === 1 && $row['revenue'] == 20;
        }));
});
