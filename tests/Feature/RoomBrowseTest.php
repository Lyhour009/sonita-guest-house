<?php

use App\Models\Reservation;
use App\Models\Room;

test('public room listing renders', function () {
    Room::factory(3)->create();

    $response = $this->get(route('home'));

    $response->assertOk();
});

test('public room detail page renders', function () {
    $room = Room::factory()->create();

    $response = $this->get(route('rooms.show', $room));

    $response->assertOk();
});

test('filtering by stay type excludes incompatible rental modes', function () {
    $shortStayOnly = Room::factory()->create(['rental_mode' => 'short_stay']);
    $longStayOnly = Room::factory()->create(['rental_mode' => 'long_stay']);

    $response = $this->get(route('home', ['stay_type' => 'short_stay']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('rooms.data', fn ($rooms) => collect($rooms)->pluck('id')->contains($shortStayOnly->id)
            && ! collect($rooms)->pluck('id')->contains($longStayOnly->id))
    );
});

test('a room with an overlapping active reservation is excluded from date-filtered results', function () {
    $room = Room::factory()->create(['rental_mode' => 'short_stay']);

    Reservation::factory()->create([
        'room_id' => $room->id,
        'reservation_type' => 'short_stay',
        'check_in_date' => '2027-01-10',
        'check_out_date' => '2027-01-15',
        'status' => 'confirmed',
    ]);

    $response = $this->get(route('home', [
        'stay_type' => 'short_stay',
        'from' => '2027-01-12',
        'to' => '2027-01-14',
    ]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('rooms.data', fn ($rooms) => ! collect($rooms)->pluck('id')->contains($room->id))
    );
});

test('a room without an overlapping reservation is still shown for the same dates', function () {
    $room = Room::factory()->create(['rental_mode' => 'short_stay']);

    Reservation::factory()->create([
        'room_id' => $room->id,
        'reservation_type' => 'short_stay',
        'check_in_date' => '2027-02-01',
        'check_out_date' => '2027-02-05',
        'status' => 'confirmed',
    ]);

    $response = $this->get(route('home', [
        'stay_type' => 'short_stay',
        'from' => '2027-03-01',
        'to' => '2027-03-05',
    ]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('rooms.data', fn ($rooms) => collect($rooms)->pluck('id')->contains($room->id))
    );
});
