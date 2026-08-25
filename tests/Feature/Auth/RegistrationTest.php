<?php

use App\Models\User;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'full_name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('home', absolute: false));

    $user = User::whereEmail('test@example.com')->firstOrFail();

    expect($user->full_name)->toBe('Test User');
    expect($user->role)->toBe('guest');
});

test('registration always creates a guest, ignoring any client-supplied role', function () {
    $this->post(route('register.store'), [
        'full_name' => 'Sneaky User',
        'email' => 'sneaky@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'admin',
    ]);

    $user = User::whereEmail('sneaky@example.com')->firstOrFail();

    expect($user->role)->toBe('guest');
});
