<?php

test('a visitor can join the waitlist for a fully-booked search', function () {
    $response = $this->post(route('waitlist.store'), [
        'email' => 'guest@example.com',
        'phone_number' => '012345678',
        'stay_type' => 'short_stay',
        'from_date' => now()->addDays(5)->toDateString(),
        'to_date' => now()->addDays(7)->toDateString(),
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('waitlist_entries', [
        'email' => 'guest@example.com',
        'stay_type' => 'short_stay',
    ]);
});

test('joining the waitlist requires a valid email and stay type', function () {
    $response = $this->post(route('waitlist.store'), [
        'email' => 'not-an-email',
        'stay_type' => 'invalid',
    ]);

    $response->assertSessionHasErrors(['email', 'stay_type']);
    $this->assertDatabaseCount('waitlist_entries', 0);
});

test('the to_date must be after the from_date', function () {
    $response = $this->post(route('waitlist.store'), [
        'email' => 'guest@example.com',
        'stay_type' => 'short_stay',
        'from_date' => now()->addDays(10)->toDateString(),
        'to_date' => now()->addDays(5)->toDateString(),
    ]);

    $response->assertSessionHasErrors('to_date');
});

test('the waitlist form works without dates for an open-ended long stay', function () {
    $response = $this->post(route('waitlist.store'), [
        'email' => 'guest@example.com',
        'stay_type' => 'long_stay',
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('waitlist_entries', [
        'email' => 'guest@example.com',
        'stay_type' => 'long_stay',
        'from_date' => null,
        'to_date' => null,
    ]);
});
