<?php

use App\Models\Room;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('guests are redirected to login', function () {
    $response = $this->get(route('admin.rooms.index'));

    $response->assertRedirect(route('login'));
});

test('non-admin roles are forbidden', function () {
    $receptionist = User::factory()->receptionist()->create();

    $response = $this->actingAs($receptionist)->get(route('admin.rooms.index'));

    $response->assertForbidden();
});

test('admin can view the room listing', function () {
    $admin = User::factory()->admin()->create();
    Room::factory(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.rooms.index'));

    $response->assertOk();
});

test('the room listing is paginated at 10 per page', function () {
    $admin = User::factory()->admin()->create();
    Room::factory(12)->create();

    $response = $this->actingAs($admin)->get(route('admin.rooms.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('rooms.data', fn ($rooms) => count($rooms) === 10)
        ->where('rooms.last_page', 2));
});

test('the room listing can be searched by room number or type', function () {
    $admin = User::factory()->admin()->create();
    $match = Room::factory()->create(['room_number' => '999', 'room_type' => 'Penthouse']);
    $other = Room::factory()->create(['room_number' => '101', 'room_type' => 'Standard']);

    $response = $this->actingAs($admin)->get(route('admin.rooms.index', ['search' => 'Penthouse']));

    $response->assertInertia(fn ($page) => $page
        ->where('rooms.data', fn ($rooms) => collect($rooms)->pluck('id')->contains($match->id)
            && ! collect($rooms)->pluck('id')->contains($other->id)));
});

test('the room listing can be filtered by rental mode and status', function () {
    $admin = User::factory()->admin()->create();
    $match = Room::factory()->create(['rental_mode' => 'long_stay', 'status' => 'maintenance']);
    $other = Room::factory()->create(['rental_mode' => 'short_stay', 'status' => 'available']);

    $response = $this->actingAs($admin)->get(route('admin.rooms.index', [
        'rental_mode' => 'long_stay',
        'status' => 'maintenance',
    ]));

    $response->assertInertia(fn ($page) => $page
        ->where('rooms.data', fn ($rooms) => collect($rooms)->pluck('id')->contains($match->id)
            && ! collect($rooms)->pluck('id')->contains($other->id)));
});

test('admin can create a room', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.rooms.store'), [
        'room_number' => '101',
        'room_type' => 'Standard',
        'rental_mode' => 'both',
        'price_per_night' => 25,
        'price_per_month' => 400,
        'status' => 'available',
        'floor' => 1,
        'max_occupants' => 2,
    ]);

    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('rooms', [
        'room_number' => '101',
        'room_type' => 'Standard',
    ]);
});

test('room number must be unique', function () {
    $admin = User::factory()->admin()->create();
    Room::factory()->create(['room_number' => '101']);

    $response = $this->actingAs($admin)->post(route('admin.rooms.store'), [
        'room_number' => '101',
        'room_type' => 'Standard',
        'rental_mode' => 'both',
        'price_per_night' => 25,
        'price_per_month' => 400,
        'status' => 'available',
        'max_occupants' => 2,
    ]);

    $response->assertSessionHasErrors('room_number');
});

test('updating a room ignores its own room number for uniqueness', function () {
    $admin = User::factory()->admin()->create();
    $room = Room::factory()->create(['room_number' => '101']);

    $response = $this->actingAs($admin)->put(route('admin.rooms.update', $room), [
        'room_number' => '101',
        'room_type' => 'Deluxe',
        'rental_mode' => 'both',
        'price_per_night' => 30,
        'price_per_month' => 500,
        'status' => 'available',
        'max_occupants' => 2,
    ]);

    $response->assertSessionHasNoErrors();
    expect($room->fresh()->room_type)->toBe('Deluxe');
});

test('admin can delete a room and its images', function () {
    Storage::fake('public');

    $admin = User::factory()->admin()->create();
    $room = Room::factory()->create();
    $room->roomImages()->create(['image_path' => 'rooms/test/image.jpg']);

    $response = $this->actingAs($admin)->delete(route('admin.rooms.destroy', $room));

    $response->assertRedirect(route('admin.rooms.index'));
    $this->assertDatabaseMissing('rooms', ['id' => $room->id]);
});

test('admin can upload images for a room', function () {
    Storage::fake('public');

    $admin = User::factory()->admin()->create();
    $room = Room::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.rooms.images.store', $room), [
        'images' => [UploadedFile::fake()->image('room.jpg')],
    ]);

    $response->assertSessionHasNoErrors();
    expect($room->roomImages()->count())->toBe(1);
});

test('admin can delete a room image', function () {
    Storage::fake('public');

    $admin = User::factory()->admin()->create();
    $room = Room::factory()->create();
    $path = UploadedFile::fake()->image('room.jpg')->store("rooms/{$room->id}", 'public');
    $image = $room->roomImages()->create(['image_path' => $path]);

    $response = $this->actingAs($admin)->delete(route('admin.rooms.images.destroy', [$room, $image]));

    $response->assertRedirect();
    $this->assertModelMissing($image);
    Storage::disk('public')->assertMissing($path);
});
