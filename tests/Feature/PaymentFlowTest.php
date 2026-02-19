<?php

use App\Enums\PaymentStatus;
use App\Models\Payment;
use App\Models\User;
use App\Services\Payment\PaymentIntentClientInterface;

test('checkout page requires authentication', function () {
    $response = $this->get(route('checkout'));

    $response->assertRedirect();
});

test('create intent requires authentication', function () {
    $response = $this->postJson('/payment/intent', ['amount' => 100]);

    $response->assertUnauthorized();
});

test('create intent validates amount is required', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/payment/intent', []);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['amount']);
});

test('create intent validates amount minimum', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/payment/intent', [
        'amount' => 49,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['amount']);
});

test('confirm payment requires authentication', function () {
    $response = $this->postJson('/payment/confirm', [
        'payment_intent_id' => 'pi_test_123',
    ]);

    $response->assertUnauthorized();
});

test('confirm payment validates payment_intent_id is required', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/payment/confirm', []);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['payment_intent_id']);
});

test('select plan requires authentication', function () {
    $response = $this->postJson(route('payment.select-plan'), ['amount' => 9900]);

    $response->assertUnauthorized();
});

test('select plan stores payment with amount and enum status', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson(route('payment.select-plan'), [
        'amount' => 15000,
        'product' => 'mirror_wills',
    ]);

    $response->assertOk();
    $response->assertJsonFragment(['amount' => 15000, 'currency' => 'gbp']);
    expect(Payment::query()->where('user_id', $user->id)->count())->toBe(1);
    $payment = Payment::query()->where('user_id', $user->id)->first();
    expect($payment->amount)->toBe(15000)
        ->and($payment->stripe_payment_intent_id)->toBeNull()
        ->and($payment->status)->toBe(PaymentStatus::Pending)
        ->and($payment->metadata)->toBe(['product' => 'mirror_wills']);
});

test('authenticated user can view checkout page', function () {
    $this->withoutVite();

    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('checkout'));

    $response->assertOk();
});

test('create intent stores payment record with pending status', function () {
    $user = User::factory()->create();
    $fakeIntent = (object) [
        'id' => 'pi_fake_'.uniqid(),
        'client_secret' => 'pi_fake_secret_'.uniqid(),
        'amount' => 9900,
        'currency' => 'gbp',
        'status' => 'requires_payment_method',
    ];

    $this->mock(PaymentIntentClientInterface::class, function ($mock) use ($fakeIntent) {
        $mock->shouldReceive('create')
            ->once()
            ->with(\Mockery::on(fn (array $params) => $params['amount'] === 9900 && $params['currency'] === 'gbp'))
            ->andReturn($fakeIntent);
    });

    $this->actingAs($user)->postJson('/payment/intent', ['amount' => 9900]);

    expect(Payment::query()->where('user_id', $user->id)->count())->toBe(1);
    $payment = Payment::query()->where('user_id', $user->id)->first();
    expect($payment->stripe_payment_intent_id)->toBe($fakeIntent->id)
        ->and($payment->amount)->toBe(9900)
        ->and($payment->currency)->toBe('gbp')
        ->and($payment->status)->toBe(PaymentStatus::Pending);
});

test('create intent updates existing payment when payment_id provided', function () {
    $user = User::factory()->create();
    $payment = Payment::factory()->create([
        'user_id' => $user->id,
        'stripe_payment_intent_id' => null,
        'amount' => 9900,
        'currency' => 'gbp',
        'status' => PaymentStatus::Pending,
    ]);
    $fakeIntent = (object) [
        'id' => 'pi_linked_'.uniqid(),
        'client_secret' => 'pi_secret_'.uniqid(),
        'amount' => 9900,
        'currency' => 'gbp',
        'status' => 'requires_payment_method',
    ];

    $this->mock(PaymentIntentClientInterface::class, function ($mock) use ($fakeIntent) {
        $mock->shouldReceive('create')->once()->andReturn($fakeIntent);
    });

    $this->actingAs($user)->postJson('/payment/intent', [
        'amount' => 9900,
        'payment_id' => $payment->id,
    ]);

    expect(Payment::query()->where('user_id', $user->id)->count())->toBe(1);
    $payment->refresh();
    expect($payment->stripe_payment_intent_id)->toBe($fakeIntent->id)
        ->and($payment->status)->toBe(PaymentStatus::Pending);
});

test('confirm payment updates payment status', function () {
    $user = User::factory()->create();
    $payment = Payment::factory()->create([
        'user_id' => $user->id,
        'stripe_payment_intent_id' => 'pi_confirm_test_123',
        'status' => 'pending',
    ]);

    $fakeIntent = (object) [
        'id' => 'pi_confirm_test_123',
        'status' => 'succeeded',
    ];

    $this->mock(PaymentIntentClientInterface::class, function ($mock) use ($fakeIntent) {
        $mock->shouldReceive('retrieve')
            ->with('pi_confirm_test_123')
            ->once()
            ->andReturn($fakeIntent);
    });

    $response = $this->actingAs($user)->postJson('/payment/confirm', [
        'payment_intent_id' => 'pi_confirm_test_123',
    ]);

    $response->assertOk();
    $payment->refresh();
    expect($payment->status)->toBe(PaymentStatus::Complete);
});
