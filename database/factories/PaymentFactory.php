<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'stripe_payment_intent_id' => 'pi_'.fake()->unique()->regexify('[A-Za-z0-9]{24}'),
            'amount' => fake()->numberBetween(1000, 50000),
            'currency' => 'gbp',
            'status' => 'succeeded',
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'pending']);
    }

    public function processing(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'processing']);
    }

    public function succeeded(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'succeeded']);
    }

    public function canceled(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'canceled']);
    }
}
