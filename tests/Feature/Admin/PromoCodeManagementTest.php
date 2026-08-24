<?php

use App\Models\PromoCode;
use App\Models\User;

test('non-admin is forbidden from the promo codes page', function () {
    $receptionist = User::factory()->receptionist()->create();

    $response = $this->actingAs($receptionist)->get(route('admin.promo-codes.index'));

    $response->assertForbidden();
});

test('admin can view the promo code listing', function () {
    $admin = User::factory()->admin()->create();
    PromoCode::factory(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.promo-codes.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->has('promoCodes.data', 3));
});

test('admin can create a promo code', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.promo-codes.store'), [
        'code' => 'welcome10',
        'discount_type' => 'percent',
        'discount_value' => 10,
        'active' => true,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('promo_codes', ['code' => 'WELCOME10', 'discount_value' => '10.00']);
});

test('promo code creation requires a unique code', function () {
    $admin = User::factory()->admin()->create();
    PromoCode::factory()->create(['code' => 'DUPLICATE']);

    $response = $this->actingAs($admin)->post(route('admin.promo-codes.store'), [
        'code' => 'DUPLICATE',
        'discount_type' => 'percent',
        'discount_value' => 10,
    ]);

    $response->assertSessionHasErrors('code');
});

test('admin can update a promo code', function () {
    $admin = User::factory()->admin()->create();
    $promoCode = PromoCode::factory()->create(['discount_value' => 10, 'active' => true]);

    $response = $this->actingAs($admin)->put(route('admin.promo-codes.update', $promoCode), [
        'code' => $promoCode->code,
        'discount_type' => 'fixed',
        'discount_value' => 25,
        'active' => false,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('promo_codes', [
        'id' => $promoCode->id,
        'discount_type' => 'fixed',
        'discount_value' => '25.00',
        'active' => false,
    ]);
});

test('a promo code can keep its own code when updating', function () {
    $admin = User::factory()->admin()->create();
    $promoCode = PromoCode::factory()->create(['code' => 'KEEPME']);

    $response = $this->actingAs($admin)->put(route('admin.promo-codes.update', $promoCode), [
        'code' => 'KEEPME',
        'discount_type' => $promoCode->discount_type,
        'discount_value' => $promoCode->discount_value,
    ]);

    $response->assertSessionHasNoErrors();
});

test('admin can delete a promo code', function () {
    $admin = User::factory()->admin()->create();
    $promoCode = PromoCode::factory()->create();

    $response = $this->actingAs($admin)->delete(route('admin.promo-codes.destroy', $promoCode));

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseMissing('promo_codes', ['id' => $promoCode->id]);
});
