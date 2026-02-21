<?php

namespace Database\Factories;

use App\Models\BulkSmsSend;
use App\Models\SmsSendLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SmsSendLog>
 */
class SmsSendLogFactory extends Factory
{
    protected $model = SmsSendLog::class;

    public function definition(): array
    {
        return [
            'bulk_sms_send_id' => BulkSmsSend::factory(),
            'phone_number' => '+4479'.$this->faker->numberBetween(10000000, 99999999),
            'message' => $this->faker->sentence(),
            'status' => 'pending',
            'provider_message_id' => null,
            'provider_response' => null,
            'error_reason' => null,
            'created_by' => User::factory(),
            'sent_at' => null,
        ];
    }

    public function sent(): static
    {
        return $this->state(fn () => [
            'status' => 'sent',
            'provider_message_id' => 'msg_'.$this->faker->uuid(),
            'sent_at' => now(),
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn () => [
            'status' => 'failed',
            'error_reason' => 'ClickSend rejected: INVALID_RECIPIENT',
        ]);
    }
}
