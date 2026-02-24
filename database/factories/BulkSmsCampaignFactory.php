<?php

namespace Database\Factories;

use App\Models\BulkSmsCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BulkSmsCampaign>
 */
class BulkSmsCampaignFactory extends Factory
{
    protected $model = BulkSmsCampaign::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'message' => fake()->sentence(),
            'csv_file_path' => null,
            'total_recipients' => fake()->numberBetween(10, 500),
            'sent_count' => 0,
            'failed_count' => 0,
            'status' => 'pending',
            'created_by' => null,
            'started_at' => null,
            'completed_at' => null,
        ];
    }

    public function processing(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => 'processing',
            'started_at' => now(),
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => 'completed',
            'started_at' => now()->subMinutes(10),
            'completed_at' => now(),
            'sent_count' => $attributes['total_recipients'] ?? 100,
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => 'failed',
            'started_at' => now()->subMinutes(5),
        ]);
    }
}
