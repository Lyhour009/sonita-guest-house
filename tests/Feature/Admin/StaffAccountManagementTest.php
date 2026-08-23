<?php

use App\Models\MaintenanceRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('non-admin is forbidden from managing staff accounts', function () {
    $receptionist = User::factory()->receptionist()->create();

    $response = $this->actingAs($receptionist)->get(route('admin.staff.index'));

    $response->assertForbidden();
});

test('admin can create a receptionist account with a hashed password and a verified email', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.staff.store'), [
        'full_name' => 'New Receptionist',
        'email' => 'new-receptionist@sonita.com',
        'phone_number' => '012345678',
        'role' => 'receptionist',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertSessionHasNoErrors();

    $staff = User::where('email', 'new-receptionist@sonita.com')->firstOrFail();
    expect($staff->role)->toBe('receptionist');
    expect($staff->email_verified_at)->not->toBeNull();
    expect(Hash::check('password123', $staff->password))->toBeTrue();
});

test('admin can create a housekeeping account', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.staff.store'), [
        'full_name' => 'New Housekeeper',
        'email' => 'new-housekeeper@sonita.com',
        'role' => 'housekeeping',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('users', ['email' => 'new-housekeeper@sonita.com', 'role' => 'housekeeping']);
});

test('a staff account cannot be created with the guest or admin role', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.staff.store'), [
        'full_name' => 'Sneaky',
        'email' => 'sneaky@sonita.com',
        'role' => 'admin',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertSessionHasErrors('role');
});

test('staff account email must be unique', function () {
    $admin = User::factory()->admin()->create();
    $existing = User::factory()->receptionist()->create(['email' => 'taken@sonita.com']);

    $response = $this->actingAs($admin)->post(route('admin.staff.store'), [
        'full_name' => 'Duplicate',
        'email' => $existing->email,
        'role' => 'receptionist',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertSessionHasErrors('email');
});

test('admin can update a staff account without changing the password', function () {
    $admin = User::factory()->admin()->create();
    $staff = User::factory()->receptionist()->create(['full_name' => 'Old Name']);
    $originalPassword = $staff->password;

    $response = $this->actingAs($admin)->patch(route('admin.staff.update', $staff), [
        'full_name' => 'New Name',
        'email' => $staff->email,
        'role' => 'receptionist',
    ]);

    $response->assertSessionHasNoErrors();
    expect($staff->fresh()->full_name)->toBe('New Name');
    expect($staff->fresh()->password)->toBe($originalPassword);
});

test('admin can reset a staff account password', function () {
    $admin = User::factory()->admin()->create();
    $staff = User::factory()->housekeeping()->create();

    $response = $this->actingAs($admin)->patch(route('admin.staff.update', $staff), [
        'full_name' => $staff->full_name,
        'email' => $staff->email,
        'role' => 'housekeeping',
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ]);

    $response->assertSessionHasNoErrors();
    expect(Hash::check('newpassword123', $staff->fresh()->password))->toBeTrue();
});

test('updating a staff account keeps their own email valid', function () {
    $admin = User::factory()->admin()->create();
    $staff = User::factory()->receptionist()->create(['email' => 'keep-me@sonita.com']);

    $response = $this->actingAs($admin)->patch(route('admin.staff.update', $staff), [
        'full_name' => $staff->full_name,
        'email' => 'keep-me@sonita.com',
        'role' => 'receptionist',
    ]);

    $response->assertSessionHasNoErrors();
});

test('the staff index only lists receptionist and housekeeping accounts', function () {
    $admin = User::factory()->admin()->create();
    $receptionist = User::factory()->receptionist()->create();
    User::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.staff.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('staff.data', fn ($staff) => collect($staff)->pluck('id')->contains($receptionist->id)
            && collect($staff)->pluck('id')->contains($admin->id) === false));
});

test('stats report staff totals and open assignments', function () {
    $admin = User::factory()->admin()->create();
    $housekeeper = User::factory()->housekeeping()->create();
    User::factory()->receptionist()->create();

    MaintenanceRequest::factory()->create(['assigned_to' => $housekeeper->id, 'status' => 'pending']);
    MaintenanceRequest::factory()->create(['assigned_to' => $housekeeper->id, 'status' => 'resolved']);

    $response = $this->actingAs($admin)->get(route('admin.staff.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('stats.total', 2)
        ->where('stats.receptionists', 1)
        ->where('stats.housekeeping', 1)
        ->where('stats.openAssignments', 1));
});

test('housekeeping workload is computed correctly and receptionists show no workload data', function () {
    $admin = User::factory()->admin()->create();
    $housekeeper = User::factory()->housekeeping()->create();
    $receptionist = User::factory()->receptionist()->create();

    MaintenanceRequest::factory()->create(['assigned_to' => $housekeeper->id, 'status' => 'in_progress']);

    $this->travelTo(now()->subDays(2));
    MaintenanceRequest::factory()->highPriority()->create(['assigned_to' => $housekeeper->id, 'status' => 'pending']);
    $this->travelBack();

    $response = $this->actingAs($admin)->get(route('admin.staff.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('staff.data', function ($staff) use ($housekeeper, $receptionist) {
            $housekeeperRow = collect($staff)->firstWhere('id', $housekeeper->id);
            $receptionistRow = collect($staff)->firstWhere('id', $receptionist->id);

            return $housekeeperRow['assigned_open_count'] === 2
                && $housekeeperRow['assigned_overdue_count'] === 1
                && $receptionistRow['assigned_open_count'] === null
                && $receptionistRow['assigned_overdue_count'] === null;
        }));
});

test('deleting a staff account with maintenance history is blocked instead of crashing', function () {
    $admin = User::factory()->admin()->create();
    $housekeeper = User::factory()->housekeeping()->create();
    MaintenanceRequest::factory()->create(['assigned_to' => $housekeeper->id]);

    $response = $this->actingAs($admin)->delete(route('admin.staff.destroy', $housekeeper));

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('users', ['id' => $housekeeper->id]);
});

test('admin can delete a staff account with no history', function () {
    $admin = User::factory()->admin()->create();
    $housekeeper = User::factory()->housekeeping()->create();

    $response = $this->actingAs($admin)->delete(route('admin.staff.destroy', $housekeeper));

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseMissing('users', ['id' => $housekeeper->id]);
});

test('deleting a non-staff account is not allowed', function () {
    $admin = User::factory()->admin()->create();
    $guest = User::factory()->create();

    $response = $this->actingAs($admin)->delete(route('admin.staff.destroy', $guest));

    $response->assertNotFound();
    $this->assertDatabaseHas('users', ['id' => $guest->id]);
});
