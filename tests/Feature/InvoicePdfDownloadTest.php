<?php

use App\Models\Invoice;
use App\Models\Reservation;
use App\Models\User;

test('a guest can download their own invoice as a pdf', function () {
    $guest = User::factory()->create();
    $reservation = Reservation::factory()->create(['guest_id' => $guest->id]);
    $invoice = Invoice::factory()->create(['reservation_id' => $reservation->id]);

    $response = $this->actingAs($guest)->get(route('invoices.pdf', $invoice));

    $response->assertOk();
    expect($response->headers->get('content-type'))->toContain('application/pdf');
});

test('a guest cannot download another guest\'s invoice', function () {
    $guest = User::factory()->create();
    $otherGuest = User::factory()->create();
    $reservation = Reservation::factory()->create(['guest_id' => $otherGuest->id]);
    $invoice = Invoice::factory()->create(['reservation_id' => $reservation->id]);

    $response = $this->actingAs($guest)->get(route('invoices.pdf', $invoice));

    $response->assertForbidden();
});

test('an admin can download any invoice as a pdf', function () {
    $admin = User::factory()->admin()->create();
    $invoice = Invoice::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.invoices.pdf', $invoice));

    $response->assertOk();
    expect($response->headers->get('content-type'))->toContain('application/pdf');
});

test('a non-admin cannot use the admin invoice pdf route', function () {
    $receptionist = User::factory()->receptionist()->create();
    $invoice = Invoice::factory()->create();

    $response = $this->actingAs($receptionist)->get(route('admin.invoices.pdf', $invoice));

    $response->assertForbidden();
});
