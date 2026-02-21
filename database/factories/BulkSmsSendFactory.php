<?php

namespace Database\Factories;

use App\Models\BulkSmsSend;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BulkSmsSend>
 */
class BulkSmsSendFactory extends Factory
{
    protected $model = BulkSmsSend::class;

    public function definition(): array
    {
        return [
            'admin_id' => User::factory(),
            'message' => $this->faker->sentence(),
            'total_numbers' => 5,
            'sent_count' => 0,
            'failed_count' => 0,
            'pending_count' => 5,
            'status' => 'pending',
            'csv_filename' => null,
        ];
    }

    public function processing(): static
    {
        return $this->state(fn () => [
            'status' => 'processing',
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn () => [
            'status' => 'completed',
            'sent_count' => 5,
            'pending_count' => 0,
        ]);
    }
}
