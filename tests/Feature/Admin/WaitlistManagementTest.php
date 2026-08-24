<?php

use App\Mail\WaitlistRoomAvailableMail;
use App\Models\User;
use App\Models\WaitlistEntry;
use Illuminate\Support\Facades\Mail;

test('non-admin is forbidden from the admin waitlist page', function () {
    $receptionist = User::factory()->receptionist()->create();

    $response = $this->actingAs($receptionist)->get(route('admin.waitlist.index'));

    $response->assertForbidden();
});

test('admin can view waitlist entries', function () {
    $admin = User::factory()->admin()->create();
    WaitlistEntry::factory(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.waitlist.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->has('entries.data', 3));
});

test('admin can search waitlist entries by email', function () {
    $admin = User::factory()->admin()->create();
    $match = WaitlistEntry::factory()->create(['email' => 'searchme@example.com']);
    WaitlistEntry::factory()->create(['email' => 'someoneelse@example.com']);

    $response = $this->actingAs($admin)->get(route('admin.waitlist.index', ['search' => 'searchme']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('entries.data', fn ($entries) => collect($entries)->pluck('id')->contains($match->id)
            && collect($entries)->count() === 1));
});

test('admin can notify a waitlist entry, which emails them and stamps notified_at', function () {
    Mail::fake();

    $admin = User::factory()->admin()->create();
    $entry = WaitlistEntry::factory()->create();

    $response = $this->actingAs($admin)->patch(route('admin.waitlist.notify', $entry));

    $response->assertRedirect();
    Mail::assertQueued(WaitlistRoomAvailableMail::class, fn (WaitlistRoomAvailableMail $mail) => $mail->hasTo($entry->email)
        && $mail->entry->is($entry));

    $this->assertNotNull($entry->fresh()->notified_at);
});
