<?php

namespace Database\Factories;

use App\Models\SmsCampaign;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SmsCampaign>
 */
class SmsCampaignFactory extends Factory
{
    protected $model = SmsCampaign::class;

    public function definition(): array
    {
        return [
            'admin_id' => User::factory(),
            'name' => $this->faker->sentence(3),
            'message' => $this->faker->sentence(),
            'sender_id' => null,
            'schedule_type' => 'one_time',
            'scheduled_at' => now()->addHour(),
            'daily_time' => null,
            'timezone' => 'Asia/Dhaka',
            'status' => 'draft',
            'total_numbers' => 5,
            'sent_count' => 0,
            'failed_count' => 0,
            'pending_count' => 5,
            'csv_filename' => null,
            'last_run_at' => null,
            'next_run_at' => null,
            'is_enabled' => true,
        ];
    }

    public function scheduled(): static
    {
        return $this->state(fn () => [
            'status' => 'scheduled',
            'next_run_at' => now()->addHour(),
        ]);
    }

    public function running(): static
    {
        return $this->state(fn () => [
            'status' => 'running',
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn () => [
            'status' => 'completed',
            'sent_count' => 5,
            'pending_count' => 0,
            'last_run_at' => now(),
        ]);
    }

    public function paused(): static
    {
        return $this->state(fn () => [
            'status' => 'paused',
            'is_enabled' => false,
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn () => [
            'status' => 'failed',
            'failed_count' => 3,
            'sent_count' => 2,
            'pending_count' => 0,
            'last_run_at' => now(),
        ]);
    }

    public function daily(): static
    {
        return $this->state(fn () => [
            'schedule_type' => 'daily',
            'scheduled_at' => null,
            'daily_time' => '21:00',
        ]);
    }

    public function oneTime(): static
    {
        return $this->state(fn () => [
            'schedule_type' => 'one_time',
            'daily_time' => null,
            'scheduled_at' => now()->addHour(),
        ]);
    }
}
