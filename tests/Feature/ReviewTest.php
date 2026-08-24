<?php

use App\Models\Reservation;
use App\Models\Review;
use App\Models\Room;
use App\Models\User;

test('a guest can review their own checked-out short stay', function () {
    $guest = User::factory()->create();
    $reservation = Reservation::factory()->create([
        'guest_id' => $guest->id,
        'reservation_type' => 'short_stay',
        'status' => 'checked_out',
    ]);

    $response = $this->actingAs($guest)->post(route('reservations.review.store', $reservation), [
        'rating' => 5,
        'comment' => 'Wonderful stay!',
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('reviews', [
        'reservation_id' => $reservation->id,
        'guest_id' => $guest->id,
        'rating' => 5,
        'comment' => 'Wonderful stay!',
    ]);
});

test('a guest cannot review another guest\'s reservation', function () {
    $guest = User::factory()->create();
    $otherGuest = User::factory()->create();
    $reservation = Reservation::factory()->create([
        'guest_id' => $otherGuest->id,
        'status' => 'checked_out',
    ]);

    $response = $this->actingAs($guest)->post(route('reservations.review.store', $reservation), [
        'rating' => 4,
    ]);

    $response->assertForbidden();
    $this->assertDatabaseCount('reviews', 0);
});

test('a reservation that is not checked out cannot be reviewed', function () {
    $guest = User::factory()->create();
    $reservation = Reservation::factory()->create([
        'guest_id' => $guest->id,
        'status' => 'confirmed',
    ]);

    $response = $this->actingAs($guest)->post(route('reservations.review.store', $reservation), [
        'rating' => 4,
    ]);

    $response->assertStatus(422);
    $this->assertDatabaseCount('reviews', 0);
});

test('a reservation cannot be reviewed twice', function () {
    $guest = User::factory()->create();
    $reservation = Reservation::factory()->create([
        'guest_id' => $guest->id,
        'status' => 'checked_out',
    ]);
    Review::factory()->create(['reservation_id' => $reservation->id, 'guest_id' => $guest->id]);

    $response = $this->actingAs($guest)->post(route('reservations.review.store', $reservation), [
        'rating' => 3,
    ]);

    $response->assertStatus(422);
    $this->assertDatabaseCount('reviews', 1);
});

test('the rating must be between 1 and 5', function () {
    $guest = User::factory()->create();
    $reservation = Reservation::factory()->create([
        'guest_id' => $guest->id,
        'status' => 'checked_out',
    ]);

    $response = $this->actingAs($guest)->post(route('reservations.review.store', $reservation), [
        'rating' => 6,
    ]);

    $response->assertSessionHasErrors('rating');
});

test('the public room detail page reports the average rating and recent reviews', function () {
    $room = Room::factory()->create();
    $firstReservation = Reservation::factory()->create(['room_id' => $room->id, 'status' => 'checked_out']);
    $secondReservation = Reservation::factory()->create(['room_id' => $room->id, 'status' => 'checked_out']);

    Review::factory()->create(['reservation_id' => $firstReservation->id, 'rating' => 5]);
    Review::factory()->create(['reservation_id' => $secondReservation->id, 'rating' => 3]);

    $response = $this->get(route('rooms.show', $room));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('room.reviews_count', 2)
        ->where('room.average_rating', fn ($value) => (float) $value === 4.0)
        ->has('room.recent_reviews', 2));
});
