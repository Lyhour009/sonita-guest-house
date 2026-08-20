<?php

use App\Models\User;

test('non-admin is forbidden from the settings page', function () {
    $receptionist = User::factory()->receptionist()->create();

    $response = $this->actingAs($receptionist)->get(route('admin.settings.edit'));

    $response->assertForbidden();
});

test('admin can view the settings page and a default row is created if none exists', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.settings.edit'));

    $response->assertOk();
    $this->assertDatabaseCount('settings', 1);
});

test('admin can update rates, tax, times, and payment instructions', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->patch(route('admin.settings.update'), [
        'currency' => 'USD',
        'tax_rate' => 12.5,
        'default_checkin_time' => '15:00',
        'default_checkout_time' => '11:00',
        'electric_rate' => 0.3,
        'water_rate' => 0.2,
        'late_fee' => 10,
        'payment_qr_url' => 'https://example.com/qr.png',
        'payment_instruction' => 'Pay via bank transfer.',
    ]);

    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('settings', [
        'tax_rate' => '12.50',
        'electric_rate' => '0.30',
        'water_rate' => '0.20',
        'late_fee' => '10.00',
        'payment_qr_url' => 'https://example.com/qr.png',
    ]);
});

test('an invalid time format is rejected', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->patch(route('admin.settings.update'), [
        'currency' => 'USD',
        'tax_rate' => 10,
        'default_checkin_time' => 'not-a-time',
        'default_checkout_time' => '11:00',
        'electric_rate' => 0,
        'water_rate' => 0,
        'late_fee' => 0,
    ]);

    $response->assertSessionHasErrors('default_checkin_time');
});

test('a negative rate is rejected', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->patch(route('admin.settings.update'), [
        'currency' => 'USD',
        'tax_rate' => -5,
        'default_checkin_time' => '14:00',
        'default_checkout_time' => '12:00',
        'electric_rate' => 0,
        'water_rate' => 0,
        'late_fee' => 0,
    ]);

    $response->assertSessionHasErrors('tax_rate');
});
