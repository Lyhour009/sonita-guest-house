<?php

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;

test('guests are redirected to login', function () {
    $response = $this->get(route('staff.payments.index'));

    $response->assertRedirect(route('login'));
});

test('housekeeping is forbidden from the payments area', function () {
    $housekeeper = User::factory()->housekeeping()->create();

    $response = $this->actingAs($housekeeper)->get(route('staff.payments.index'));

    $response->assertForbidden();
});

test('receptionist can view the payment listing', function () {
    $receptionist = User::factory()->receptionist()->create();
    Payment::factory(3)->create();

    $response = $this->actingAs($receptionist)->get(route('staff.payments.index'));

    $response->assertOk();
});

test('the payment listing can be searched by guest name or email', function () {
    $receptionist = User::factory()->receptionist()->create();

    $guest = User::factory()->create(['full_name' => 'Sokha Chan', 'email' => 'sokha@example.com']);
    $match = Payment::factory()->create(['guest_id' => $guest->id]);
    $other = Payment::factory()->create();

    $response = $this->actingAs($receptionist)->get(route('staff.payments.index', ['search' => 'Sokha']));

    $response->assertInertia(fn ($page) => $page
        ->where('payments.data', function ($payments) use ($match, $other) {
            $ids = collect($payments)->pluck('id');

            return $ids->contains($match->id) && ! $ids->contains($other->id);
        }));
});

test('the payment listing can be filtered by status', function () {
    $receptionist = User::factory()->receptionist()->create();

    $pending = Payment::factory()->create(['status' => 'pending']);
    Payment::factory()->create(['status' => 'confirmed']);

    $response = $this->actingAs($receptionist)->get(route('staff.payments.index', ['status' => 'pending']));

    $response->assertInertia(fn ($page) => $page
        ->where('payments.data', fn ($payments) => count($payments) === 1
            && $payments[0]['id'] === $pending->id));
});

test('status counts include the stale pending count', function () {
    $receptionist = User::factory()->receptionist()->create();

    $this->travelTo(now()->subDays(3));
    Payment::factory()->create(['status' => 'pending']);
    $this->travelBack();

    Payment::factory()->create(['status' => 'pending']);
    Payment::factory()->create(['status' => 'confirmed']);

    $response = $this->actingAs($receptionist)->get(route('staff.payments.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('statusCounts.all', 3)
        ->where('statusCounts.pending', 2)
        ->where('statusCounts.confirmed', 1)
        ->where('statusCounts.stale', 1));
});

test('invoice outstanding balance and settles-invoice flag are computed correctly', function () {
    $receptionist = User::factory()->receptionist()->create();

    $invoice = Invoice::factory()->create(['total_amount' => 100]);
    Payment::factory()->create(['invoice_id' => $invoice->id, 'status' => 'confirmed', 'amount' => 40]);
    $pendingPayment = Payment::factory()->create(['invoice_id' => $invoice->id, 'status' => 'pending', 'amount' => 60]);

    $response = $this->actingAs($receptionist)->get(route('staff.payments.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('payments.data', function ($payments) use ($pendingPayment) {
            $row = collect($payments)->firstWhere('id', $pendingPayment->id);

            return $row['invoice']['outstanding_balance'] == 60
                && $row['settles_invoice'] === true;
        }));
});
