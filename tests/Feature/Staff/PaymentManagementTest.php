<?php

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;

test('guests are forbidden from the staff payments area', function () {
    $guest = User::factory()->create();

    $response = $this->actingAs($guest)->get(route('staff.payments.index'));

    $response->assertForbidden();
});

test('confirming a payment recalculates the invoice status through unpaid to partial to paid', function () {
    $receptionist = User::factory()->receptionist()->create();
    $invoice = Invoice::factory()->create(['total_amount' => 100, 'status' => 'unpaid']);

    $firstPayment = Payment::factory()->create([
        'invoice_id' => $invoice->id,
        'amount' => 40,
        'status' => 'pending',
    ]);

    $this->actingAs($receptionist)
        ->patch(route('staff.payments.confirm', $firstPayment))
        ->assertSessionHasNoErrors();

    expect($invoice->fresh()->status)->toBe('partial');

    $secondPayment = Payment::factory()->create([
        'invoice_id' => $invoice->id,
        'amount' => 60,
        'status' => 'pending',
    ]);

    $this->actingAs($receptionist)
        ->patch(route('staff.payments.confirm', $secondPayment))
        ->assertSessionHasNoErrors();

    expect($invoice->fresh()->status)->toBe('paid');
});

test('rejecting a payment does not affect the invoice status', function () {
    $receptionist = User::factory()->receptionist()->create();
    $invoice = Invoice::factory()->create(['total_amount' => 100, 'status' => 'unpaid']);
    $payment = Payment::factory()->create(['invoice_id' => $invoice->id, 'amount' => 100, 'status' => 'pending']);

    $this->actingAs($receptionist)
        ->patch(route('staff.payments.reject', $payment))
        ->assertSessionHasNoErrors();

    expect($payment->fresh()->status)->toBe('failed');
    expect($invoice->fresh()->status)->toBe('unpaid');
});
