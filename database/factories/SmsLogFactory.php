<?php

namespace Database\Factories;

use App\Models\SmsLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SmsLog>
 */
class SmsLogFactory extends Factory
{
    protected $model = SmsLog::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'to' => fake()->e164PhoneNumber(),
            'from' => fake()->e164PhoneNumber(),
            'message' => fake()->sentence(),
            'status' => fake()->randomElement(['pending', 'sent', 'failed']),
            'twilio_sid' => 'SM'.fake()->sha1(),
            'type' => 'single',
            'bulk_campaign_id' => null,
            'error_message' => null,
        ];
    }

    public function sent(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => 'sent',
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => 'failed',
            'error_message' => fake()->sentence(),
        ]);
    }

    public function bulk(): static
    {
        return $this->state(fn (array $attributes): array => [
            'type' => 'bulk',
        ]);
    }
}
