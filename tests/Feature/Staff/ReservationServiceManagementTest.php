<?php

use App\Models\Reservation;
use App\Models\Service;
use App\Models\User;

test('guests are forbidden from attaching services to a reservation', function () {
    $guest = User::factory()->create();
    $reservation = Reservation::factory()->create();
    $service = Service::factory()->create();

    $response = $this->actingAs($guest)->post(route('staff.reservations.services.store', $reservation), [
        'service_id' => $service->id,
        'quantity' => 1,
    ]);

    $response->assertForbidden();
});

test('receptionist can attach a service to a reservation', function () {
    $receptionist = User::factory()->receptionist()->create();
    $reservation = Reservation::factory()->create();
    $service = Service::factory()->create(['price' => 15]);

    $response = $this->actingAs($receptionist)->post(route('staff.reservations.services.store', $reservation), [
        'service_id' => $service->id,
        'quantity' => 2,
    ]);

    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('reservation_service', [
        'reservation_id' => $reservation->id,
        'service_id' => $service->id,
        'quantity' => 2,
        'unit_price' => 15,
    ]);
});

test('receptionist can remove a service from a reservation', function () {
    $receptionist = User::factory()->receptionist()->create();
    $reservation = Reservation::factory()->create();
    $service = Service::factory()->create(['price' => 15]);
    $reservation->services()->attach($service->id, ['quantity' => 2, 'unit_price' => 15]);

    $response = $this->actingAs($receptionist)->delete(route('staff.reservations.services.destroy', [$reservation, $service]));

    $response->assertSessionHasNoErrors();

    $this->assertDatabaseMissing('reservation_service', [
        'reservation_id' => $reservation->id,
        'service_id' => $service->id,
    ]);
});
