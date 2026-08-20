<?php

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('a guest can submit a payment for their own invoice', function () {
    Storage::fake('local');

    $guest = User::factory()->create();
    $reservation = Reservation::factory()->create(['guest_id' => $guest->id]);
    $invoice = Invoice::factory()->create(['reservation_id' => $reservation->id, 'total_amount' => 100]);

    $response = $this->actingAs($guest)->post(route('payments.store'), [
        'invoice_id' => $invoice->id,
        'amount' => 100,
        'method' => 'bank_transfer',
        'proof_image' => UploadedFile::fake()->image('proof.jpg'),
    ]);

    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('payments', [
        'invoice_id' => $invoice->id,
        'guest_id' => $guest->id,
        'status' => 'pending',
        'amount' => '100.00',
    ]);
});

test('a guest cannot submit a payment for someone else\'s invoice', function () {
    $guest = User::factory()->create();
    $otherGuest = User::factory()->create();
    $reservation = Reservation::factory()->create(['guest_id' => $otherGuest->id]);
    $invoice = Invoice::factory()->create(['reservation_id' => $reservation->id]);

    $response = $this->actingAs($guest)->post(route('payments.store'), [
        'invoice_id' => $invoice->id,
        'amount' => 50,
        'method' => 'cash',
    ]);

    $response->assertForbidden();
});

test('a guest only sees their own invoices', function () {
    $guest = User::factory()->create();
    $otherGuest = User::factory()->create();

    $mine = Reservation::factory()->create(['guest_id' => $guest->id]);
    $mineInvoice = Invoice::factory()->create(['reservation_id' => $mine->id]);
    $other = Reservation::factory()->create(['guest_id' => $otherGuest->id]);
    Invoice::factory()->create(['reservation_id' => $other->id]);

    $response = $this->actingAs($guest)->get(route('invoices.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('invoices.data', fn ($invoices) => count($invoices) === 1
            && $invoices[0]['id'] === $mineInvoice->id));
});

test('a guest only sees their own payments', function () {
    $guest = User::factory()->create();
    $otherGuest = User::factory()->create();

    $mine = Payment::factory()->create(['guest_id' => $guest->id]);
    Payment::factory()->create(['guest_id' => $otherGuest->id]);

    $response = $this->actingAs($guest)->get(route('payments.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('payments.data', fn ($payments) => count($payments) === 1
            && $payments[0]['id'] === $mine->id));
});
