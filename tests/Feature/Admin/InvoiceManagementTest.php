<?php

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;

test('guests are redirected to login', function () {
    $response = $this->get(route('admin.invoices.index'));

    $response->assertRedirect(route('login'));
});

test('non-admin roles are forbidden', function () {
    $receptionist = User::factory()->receptionist()->create();

    $response = $this->actingAs($receptionist)->get(route('admin.invoices.index'));

    $response->assertForbidden();
});

test('admin can view the invoice listing', function () {
    $admin = User::factory()->admin()->create();
    Invoice::factory(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.invoices.index'));

    $response->assertOk();
});

test('the invoice listing can be searched by guest name or room number', function () {
    $admin = User::factory()->admin()->create();

    $guest = User::factory()->create(['full_name' => 'Sokha Chan']);
    $room = Room::factory()->create(['room_number' => '404']);
    $reservation = Reservation::factory()->create(['guest_id' => $guest->id, 'room_id' => $room->id]);
    $match = Invoice::factory()->create(['reservation_id' => $reservation->id]);

    $other = Invoice::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.invoices.index', ['search' => 'Sokha']));

    $response->assertInertia(fn ($page) => $page
        ->where('invoices.data', function ($invoices) use ($match, $other) {
            $ids = collect($invoices)->pluck('id');

            return $ids->contains($match->id) && ! $ids->contains($other->id);
        }));
});

test('the overdue filter only returns unpaid or partial invoices past their due date', function () {
    $admin = User::factory()->admin()->create();

    $overdue = Invoice::factory()->create(['status' => 'unpaid', 'due_date' => now()->subDays(3)->toDateString()]);
    Invoice::factory()->create(['status' => 'unpaid', 'due_date' => now()->addDays(3)->toDateString()]);
    Invoice::factory()->create(['status' => 'paid', 'due_date' => now()->subDays(3)->toDateString()]);

    $response = $this->actingAs($admin)->get(route('admin.invoices.index', ['status' => 'overdue']));

    $response->assertInertia(fn ($page) => $page
        ->where('invoices.data', fn ($invoices) => collect($invoices)->pluck('id')->contains($overdue->id)
            && count($invoices) === 1)
        ->where('statusCounts.overdue', 1));
});

test('outstanding balance and overdue flag are computed correctly in the payload', function () {
    $admin = User::factory()->admin()->create();

    $invoice = Invoice::factory()->create([
        'status' => 'partial',
        'total_amount' => 100,
        'due_date' => now()->subDay()->toDateString(),
    ]);
    Payment::factory()->create(['invoice_id' => $invoice->id, 'status' => 'confirmed', 'amount' => 40]);
    Payment::factory()->create(['invoice_id' => $invoice->id, 'status' => 'pending', 'amount' => 20]);

    $response = $this->actingAs($admin)->get(route('admin.invoices.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('invoices.data', function ($invoices) use ($invoice) {
            $row = collect($invoices)->firstWhere('id', $invoice->id);

            return $row['outstanding_balance'] == 60 && $row['is_overdue'] === true;
        }));
});
