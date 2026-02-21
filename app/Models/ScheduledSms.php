<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int|null $user_id
 * @property string $to_phone
 * @property string $message
 * @property \Illuminate\Support\Carbon $scheduled_at
 * @property string $timezone
 * @property string $status
 * @property int $attempts
 * @property int $max_attempts
 * @property string|null $provider_message_id
 * @property string|null $last_error
 * @property \Illuminate\Support\Carbon|null $sent_at
 * @property \Illuminate\Support\Carbon|null $delivered_at
 * @property string $idempotency_key
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class ScheduledSms extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'to_phone', 'message', 'scheduled_at',
        'timezone', 'status', 'attempts', 'max_attempts',
        'provider_message_id', 'last_error', 'sent_at',
        'delivered_at', 'idempotency_key',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function canRetry(): bool
    {
        return $this->status === 'failed' && $this->attempts < $this->max_attempts;
    }

    protected static function booted(): void
    {
        static::creating(function (self $model) {
            if (empty($model->idempotency_key)) {
                $model->idempotency_key = hash('sha256',
                    $model->to_phone.$model->message.$model->scheduled_at->toIso8601String()
                );
            }
        });
    }
}
