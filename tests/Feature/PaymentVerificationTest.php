<?php

use App\Enums\PaymentProduct;
use App\Enums\PaymentStatus;
use App\Models\Payment;
use App\Models\User;

test('payment verification requires authentication', function () {
    $response = $this->postJson('/payment/verify', [
        'product' => 'single_will',
    ]);

    $response->assertUnauthorized();
});

test('payment verification validates product is required', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/payment/verify', []);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['product']);
});

test('payment verification returns invalid for unknown product', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/payment/verify', [
        'product' => 'invalid_product',
    ]);

    $response->assertStatus(422);
    $response->assertJsonFragment(['paid' => false]);
});

test('payment verification returns unpaid when no payment exists', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/payment/verify', [
        'product' => 'single_will',
    ]);

    $response->assertOk();
    $response->assertJsonFragment([
        'paid' => false,
        'product' => 'single_will',
    ]);
});

test('payment verification returns unpaid when payment is pending', function () {
    $user = User::factory()->create();

    Payment::factory()->create([
        'user_id' => $user->id,
        'status' => PaymentStatus::Pending,
        'metadata' => ['product' => 'single_will'],
    ]);

    $response = $this->actingAs($user)->postJson('/payment/verify', [
        'product' => 'single_will',
    ]);

    $response->assertOk();
    $response->assertJsonFragment(['paid' => false]);
});

test('payment verification returns paid when payment succeeded', function () {
    $user = User::factory()->create();

    Payment::factory()->create([
        'user_id' => $user->id,
        'status' => PaymentStatus::Complete,
        'metadata' => ['product' => 'single_will'],
    ]);

    $response = $this->actingAs($user)->postJson('/payment/verify', [
        'product' => 'single_will',
    ]);

    $response->assertOk();
    $response->assertJsonFragment([
        'paid' => true,
        'product' => 'single_will',
    ]);
});

test('payment verification distinguishes between single and mirror will', function () {
    $user = User::factory()->create();

    Payment::factory()->create([
        'user_id' => $user->id,
        'status' => PaymentStatus::Complete,
        'metadata' => ['product' => 'single_will'],
    ]);

    // Should be paid for single_will
    $response = $this->actingAs($user)->postJson('/payment/verify', [
        'product' => 'single_will',
    ]);
    $response->assertOk();
    $response->assertJsonFragment(['paid' => true]);

    // Should NOT be paid for mirror_will
    $response = $this->actingAs($user)->postJson('/payment/verify', [
        'product' => 'mirror_will',
    ]);
    $response->assertOk();
    $response->assertJsonFragment(['paid' => false]);
});

test('payment verification returns correct amount for each product', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/payment/verify', [
        'product' => 'single_will',
    ]);
    $response->assertJsonFragment(['amount' => 7800]);

    $response = $this->actingAs($user)->postJson('/payment/verify', [
        'product' => 'mirror_will',
    ]);
    $response->assertJsonFragment(['amount' => 9000]);

    $response = $this->actingAs($user)->postJson('/payment/verify', [
        'product' => 'lpa_property',
    ]);
    $response->assertJsonFragment(['amount' => 11880]);
});

test('user model hasPaymentFor returns true for matching product', function () {
    $user = User::factory()->create();

    Payment::factory()->create([
        'user_id' => $user->id,
        'status' => PaymentStatus::Complete,
        'metadata' => ['product' => 'single_will'],
    ]);

    expect($user->hasPaymentFor(PaymentProduct::SingleWill))->toBeTrue();
    expect($user->hasPaymentFor(PaymentProduct::MirrorWill))->toBeFalse();
    expect($user->hasPaymentFor(PaymentProduct::LpaProperty))->toBeFalse();
});

test('payment model forProduct scope filters correctly', function () {
    $user = User::factory()->create();

    Payment::factory()->create([
        'user_id' => $user->id,
        'status' => PaymentStatus::Complete,
        'metadata' => ['product' => 'single_will'],
    ]);

    Payment::factory()->create([
        'user_id' => $user->id,
        'status' => PaymentStatus::Complete,
        'metadata' => ['product' => 'mirror_will'],
    ]);

    expect(Payment::query()->forProduct(PaymentProduct::SingleWill)->count())->toBe(1);
    expect(Payment::query()->forProduct(PaymentProduct::MirrorWill)->count())->toBe(1);
    expect(Payment::query()->forProduct(PaymentProduct::LpaProperty)->count())->toBe(0);
});

test('payment product enum returns correct values', function () {
    expect(PaymentProduct::SingleWill->amountInPence())->toBe(7800);
    expect(PaymentProduct::MirrorWill->amountInPence())->toBe(9000);
    expect(PaymentProduct::LpaProperty->amountInPence())->toBe(11880);
    expect(PaymentProduct::LpaHealth->amountInPence())->toBe(11880);

    expect(PaymentProduct::SingleWill->isWill())->toBeTrue();
    expect(PaymentProduct::MirrorWill->isWill())->toBeTrue();
    expect(PaymentProduct::LpaProperty->isLpa())->toBeTrue();
    expect(PaymentProduct::LpaHealth->isLpa())->toBeTrue();

    expect(PaymentProduct::fromWillType('Me'))->toBe(PaymentProduct::SingleWill);
    expect(PaymentProduct::fromWillType('Mirror'))->toBe(PaymentProduct::MirrorWill);
    expect(PaymentProduct::fromLpaType('property'))->toBe(PaymentProduct::LpaProperty);
    expect(PaymentProduct::fromLpaType('health'))->toBe(PaymentProduct::LpaHealth);
});

test('select plan stores product in payment metadata', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson(route('payment.select-plan'), [
        'amount' => 7800,
        'product' => 'single_will',
    ]);

    $response->assertOk();
    $payment = Payment::query()->where('user_id', $user->id)->latest()->first();
    expect($payment->metadata['product'])->toBe('single_will');
});

test('checkout page accepts product and redirect_url params', function () {
    $this->withoutVite();
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('checkout', [
        'amount' => 7800,
        'product' => 'single_will',
        'redirect_url' => '/will-writing/start',
    ]));

    $response->assertOk();
});
