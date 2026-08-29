<?php

use App\Models\Invoice;
use App\Models\MaintenanceRequest;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('the guest dashboard only shows their own reservation and invoice', function () {
    $guest = User::factory()->create();
    $otherGuest = User::factory()->create();

    $reservation = Reservation::factory()->create(['guest_id' => $guest->id, 'status' => 'confirmed']);
    $invoice = Invoice::factory()->create(['reservation_id' => $reservation->id]);

    $otherReservation = Reservation::factory()->create(['guest_id' => $otherGuest->id, 'status' => 'confirmed']);
    Invoice::factory()->create(['reservation_id' => $otherReservation->id]);

    $response = $this->actingAs($guest)->get(route('dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('reservations', fn ($reservations) => count($reservations) === 1
            && $reservations[0]['id'] === $reservation->id)
        ->where('latestInvoice.id', $invoice->id)
        ->missing('arrivals'));
});

test('the receptionist dashboard reports today\'s arrivals and departures', function () {
    $receptionist = User::factory()->receptionist()->create();

    $arrivingReservation = Reservation::factory()->create([
        'reservation_type' => 'short_stay',
        'check_in_date' => now()->toDateString(),
        'status' => 'confirmed',
    ]);

    $departingReservation = Reservation::factory()->create([
        'reservation_type' => 'short_stay',
        'check_out_date' => now()->toDateString(),
        'status' => 'checked_in',
    ]);

    $response = $this->actingAs($receptionist)->get(route('dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('arrivals', fn ($arrivals) => count($arrivals) === 1
            && $arrivals[0]['id'] === $arrivingReservation->id)
        ->where('departures', fn ($departures) => count($departures) === 1
            && $departures[0]['id'] === $departingReservation->id));
});

test('the housekeeping dashboard reports cleaning and assigned maintenance counts', function () {
    $housekeeper = User::factory()->housekeeping()->create();

    $cleaningRoom = Room::factory()->create(['status' => 'cleaning']);
    Room::factory()->create(['status' => 'available']);

    $lowPriorityRequest = MaintenanceRequest::factory()->create([
        'assigned_to' => $housekeeper->id,
        'status' => 'in_progress',
        'priority' => 'low',
    ]);
    $highPriorityRequest = MaintenanceRequest::factory()->create([
        'assigned_to' => $housekeeper->id,
        'status' => 'pending',
        'priority' => 'high',
    ]);
    MaintenanceRequest::factory()->create(['assigned_to' => $housekeeper->id, 'status' => 'resolved']);

    $response = $this->actingAs($housekeeper)->get(route('dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('roomsAwaitingCleaning', 1)
        ->where('openAssignedMaintenance', 2)
        ->where('cleaningRooms', fn ($rooms) => count($rooms) === 1
            && $rooms[0]['id'] === $cleaningRoom->id)
        ->where('assignedMaintenance', fn ($requests) => count($requests) === 2
            && $requests[0]['id'] === $highPriorityRequest->id
            && $requests[1]['id'] === $lowPriorityRequest->id));
});
