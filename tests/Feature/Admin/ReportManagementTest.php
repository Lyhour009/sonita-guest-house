<?php

use App\Models\Invoice;
use App\Models\MaintenanceRequest;
use App\Models\Payment;
use App\Models\User;

test('non-admin is forbidden from the reports page', function () {
    $receptionist = User::factory()->receptionist()->create();

    $response = $this->actingAs($receptionist)->get(route('admin.reports.index'));

    $response->assertForbidden();
});

test('admin can view the reports page with a default date range', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.reports.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('report.revenue')
        ->has('report.revenueByDay'));
});

test('the report totals confirmed revenue within the chosen date range', function () {
    $admin = User::factory()->admin()->create();

    $invoice = Invoice::factory()->create(['total_amount' => 100, 'status' => 'paid']);
    Payment::factory()->create([
        'invoice_id' => $invoice->id,
        'amount' => 60,
        'status' => 'confirmed',
        'paid_at' => '2027-03-10',
    ]);
    Payment::factory()->create([
        'invoice_id' => $invoice->id,
        'amount' => 999,
        'status' => 'confirmed',
        'paid_at' => '2027-04-10',
    ]);
    Payment::factory()->create([
        'invoice_id' => $invoice->id,
        'amount' => 999,
        'status' => 'pending',
        'paid_at' => null,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.reports.index', [
        'from' => '2027-03-01',
        'to' => '2027-03-31',
    ]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('report.revenue', fn ($value) => (float) $value === 60.0));
});

test('the report counts maintenance requests resolved within the range', function () {
    $admin = User::factory()->admin()->create();

    MaintenanceRequest::factory()->create([
        'status' => 'resolved',
        'resolved_at' => '2027-03-15',
    ]);
    MaintenanceRequest::factory()->create([
        'status' => 'resolved',
        'resolved_at' => '2027-05-15',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.reports.index', [
        'from' => '2027-03-01',
        'to' => '2027-03-31',
    ]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('report.maintenanceResolvedCount', 1));
});

test('the report can be exported as csv', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.reports.export.csv'));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
});

test('the report can be exported as pdf', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.reports.export.pdf'));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/pdf');
});
