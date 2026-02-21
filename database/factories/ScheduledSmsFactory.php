<?php

namespace Database\Factories;

use App\Models\ScheduledSms;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScheduledSmsFactory extends Factory
{
    protected $model = ScheduledSms::class;

    public function definition(): array
    {
        $scheduledAt = $this->faker->dateTimeBetween('+1 hour', '+30 days');

        return [
            'user_id' => null,
            'to_phone' => '+4479'.$this->faker->numberBetween(10000000, 99999999),
            'message' => $this->faker->paragraph(),
            'scheduled_at' => Carbon::instance($scheduledAt)->setTimezone('UTC'),
            'timezone' => 'Asia/Dhaka',
            'status' => 'pending',
            'attempts' => 0,
            'max_attempts' => 3,
            'provider_message_id' => null,
            'last_error' => null,
            'sent_at' => null,
            'delivered_at' => null,
        ];
    }

    public function sent(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'sent',
                'sent_at' => now(),
                'provider_message_id' => 'msg-'.$this->faker->uuid(),
            ];
        });
    }

    public function delivered(): Factory
    {
        return $this->sent()->state(function (array $attributes) {
            return [
                'status' => 'delivered',
                'delivered_at' => now(),
            ];
        });
    }

    public function failed(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'failed',
                'attempts' => 3,
                'last_error' => 'Network error',
            ];
        });
    }

    public function processing(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'processing',
                'attempts' => 1,
            ];
        });
    }
}
