<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;

beforeEach(function () {
    Route::middleware(['web', 'auth', 'role:admin,receptionist'])
        ->get('/__test/staff-only', fn () => 'ok');
});

test('guests are redirected to login', function () {
    $response = $this->get('/__test/staff-only');

    $response->assertRedirect(route('login'));
});

test('users with a matching role are allowed through', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/__test/staff-only');

    $response->assertOk()->assertSee('ok');
});

test('users with a non-matching role are forbidden', function () {
    $guest = User::factory()->create();

    $response = $this->actingAs($guest)->get('/__test/staff-only');

    $response->assertForbidden();
});
