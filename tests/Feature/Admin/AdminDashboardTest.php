<?php

use App\Models\Invoice;
use App\Models\MaintenanceRequest;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;

test('non-admin is forbidden from the admin dashboard', function () {
    $receptionist = User::factory()->receptionist()->create();

    $response = $this->actingAs($receptionist)->get(route('admin.dashboard.index'));

    $response->assertForbidden();
});

test('the admin dashboard reports occupancy, revenue this month, outstanding invoices, and open maintenance', function () {
    $admin = User::factory()->admin()->create();

    Room::factory()->count(4)->create(['status' => 'available']);
    Reservation::factory()->create(['reservation_type' => 'short_stay', 'status' => 'checked_in']);
    Reservation::factory()->longStay()->create(['status' => 'active']);

    $thisMonthInvoice = Invoice::factory()->create(['total_amount' => 100, 'status' => 'paid']);
    Payment::factory()->create([
        'invoice_id' => $thisMonthInvoice->id,
        'amount' => 100,
        'status' => 'confirmed',
        'paid_at' => now(),
    ]);

    $lastMonthInvoice = Invoice::factory()->create(['total_amount' => 50, 'status' => 'paid']);
    Payment::factory()->create([
        'invoice_id' => $lastMonthInvoice->id,
        'amount' => 50,
        'status' => 'confirmed',
        'paid_at' => now()->subMonth(),
    ]);

    Invoice::factory()->create(['status' => 'unpaid']);
    Invoice::factory()->create(['status' => 'partial']);
    Invoice::factory()->create(['status' => 'paid']);

    MaintenanceRequest::factory()->create(['status' => 'pending']);
    MaintenanceRequest::factory()->create(['status' => 'resolved']);

    $response = $this->actingAs($admin)->get(route('admin.dashboard.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('occupancy.short_stay', 1)
        ->where('occupancy.long_stay', 1)
        ->where('revenueThisMonth', fn ($value) => (float) $value === 100.0)
        ->where('outstandingInvoicesCount', 2)
        ->where('openMaintenanceCount', 1));
});
