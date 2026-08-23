<?php

use App\Mail\UserNotificationMail;
use App\Models\Invoice;
use App\Models\MaintenanceRequest;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Setting::create([
        'currency' => 'USD',
        'tax_rate' => 10,
        'electric_rate' => 0.25,
        'water_rate' => 0.15,
        'late_fee' => 5,
    ]);
});

test('confirming a reservation notifies the guest', function () {
    Mail::fake();

    $receptionist = User::factory()->receptionist()->create();
    $guest = User::factory()->create();
    $reservation = Reservation::factory()->create(['guest_id' => $guest->id, 'status' => 'pending']);

    $this->actingAs($receptionist)->patch(route('staff.reservations.confirm', $reservation));

    $this->assertDatabaseHas('notifications', [
        'user_id' => $guest->id,
        'type' => 'reservation_confirmed',
        'is_read' => false,
    ]);

    Mail::assertQueued(UserNotificationMail::class, fn (UserNotificationMail $mail) => $mail->hasTo($guest->email)
        && $mail->type === 'reservation_confirmed');
});

test('checking out a short-stay reservation notifies the guest that an invoice was issued', function () {
    $receptionist = User::factory()->receptionist()->create();
    $guest = User::factory()->create();
    $room = Room::factory()->create(['price_per_night' => 50]);
    $reservation = Reservation::factory()->create([
        'guest_id' => $guest->id,
        'room_id' => $room->id,
        'reservation_type' => 'short_stay',
        'check_in_date' => now()->subDays(2)->toDateString(),
        'check_out_date' => now()->toDateString(),
        'status' => 'checked_in',
    ]);

    $this->actingAs($receptionist)->patch(route('staff.reservations.check-out', $reservation));

    $this->assertDatabaseHas('notifications', [
        'user_id' => $guest->id,
        'type' => 'invoice_issued',
    ]);
});

test('generating a long-stay invoice notifies the guest', function () {
    $admin = User::factory()->admin()->create();
    $guest = User::factory()->create();
    $reservation = Reservation::factory()->longStay()->create([
        'guest_id' => $guest->id,
        'status' => 'active',
    ]);

    $this->actingAs($admin)->post(route('admin.invoices.store'), [
        'reservation_id' => $reservation->id,
        'elec_meter_start' => 0,
        'elec_meter_end' => 10,
        'water_meter_start' => 0,
        'water_meter_end' => 10,
    ]);

    $this->assertDatabaseHas('notifications', [
        'user_id' => $guest->id,
        'type' => 'invoice_issued',
    ]);
});

test('confirming a payment notifies the guest', function () {
    Mail::fake();

    $receptionist = User::factory()->receptionist()->create();
    $guest = User::factory()->create();
    $invoice = Invoice::factory()->create(['total_amount' => 100]);
    $payment = Payment::factory()->create([
        'invoice_id' => $invoice->id,
        'guest_id' => $guest->id,
        'status' => 'pending',
    ]);

    $this->actingAs($receptionist)->patch(route('staff.payments.confirm', $payment));

    $this->assertDatabaseHas('notifications', [
        'user_id' => $guest->id,
        'type' => 'payment_confirmed',
    ]);

    Mail::assertQueued(UserNotificationMail::class, fn (UserNotificationMail $mail) => $mail->hasTo($guest->email)
        && $mail->type === 'payment_confirmed');

    $notification = $guest->notifications()->where('type', 'payment_confirmed')->firstOrFail();
    expect($notification->data)->toBe(['amount' => (string) $payment->amount]);
});

test('updating a maintenance request status notifies the reporter', function () {
    $housekeeper = User::factory()->housekeeping()->create();
    $reporter = User::factory()->create();
    $request = MaintenanceRequest::factory()->create([
        'reporter_id' => $reporter->id,
        'assigned_to' => $housekeeper->id,
        'status' => 'in_progress',
        'title' => 'Leaky faucet',
    ]);

    $this->actingAs($housekeeper)->patch(route('staff.maintenance.status', $request), [
        'status' => 'resolved',
    ]);

    $this->assertDatabaseHas('notifications', [
        'user_id' => $reporter->id,
        'type' => 'maintenance_status_changed',
    ]);

    $notification = $reporter->notifications()->where('type', 'maintenance_status_changed')->firstOrFail();
    expect($notification->data)->toBe(['title' => 'Leaky faucet', 'status' => 'resolved']);
});

test('a user only sees their own notifications', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $mine = Notification::factory()->create(['user_id' => $user->id]);
    Notification::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->get(route('notifications.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('notifications.data', fn ($notifications) => count($notifications) === 1
            && $notifications[0]['id'] === $mine->id));
});

test('a user can mark their own notification as read', function () {
    $user = User::factory()->create();
    $notification = Notification::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->patch(route('notifications.read', $notification));

    $response->assertSessionHasNoErrors();
    expect($notification->fresh()->is_read)->toBeTrue();
});

test('a user cannot mark someone else\'s notification as read', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $notification = Notification::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->patch(route('notifications.read', $notification));

    $response->assertForbidden();
});

test('mark all as read clears every unread notification for the user', function () {
    $user = User::factory()->create();
    Notification::factory()->count(3)->create(['user_id' => $user->id]);

    $this->actingAs($user)->patch(route('notifications.read-all'));

    expect($user->notifications()->where('is_read', false)->count())->toBe(0);
});

test('the shared unread notifications count reflects the true unread count', function () {
    $user = User::factory()->create();
    Notification::factory()->count(2)->create(['user_id' => $user->id]);
    Notification::factory()->read()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertInertia(fn ($page) => $page->where('unreadNotificationsCount', 2));
});
