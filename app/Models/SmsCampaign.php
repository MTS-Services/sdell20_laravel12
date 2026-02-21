<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $admin_id
 * @property string|null $name
 * @property string $message
 * @property string|null $sender_id
 * @property string $schedule_type
 * @property \Illuminate\Support\Carbon|null $scheduled_at
 * @property string|null $daily_time
 * @property string $timezone
 * @property string $status
 * @property int $total_numbers
 * @property int $sent_count
 * @property int $failed_count
 * @property int $pending_count
 * @property string|null $csv_filename
 * @property \Illuminate\Support\Carbon|null $last_run_at
 * @property \Illuminate\Support\Carbon|null $next_run_at
 * @property bool $is_enabled
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class SmsCampaign extends Model
{
    /** @use HasFactory<\Database\Factories\SmsCampaignFactory> */
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'name',
        'message',
        'sender_id',
        'schedule_type',
        'scheduled_at',
        'daily_time',
        'timezone',
        'status',
        'total_numbers',
        'sent_count',
        'failed_count',
        'pending_count',
        'csv_filename',
        'last_run_at',
        'next_run_at',
        'is_enabled',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'last_run_at' => 'datetime',
            'next_run_at' => 'datetime',
            'is_enabled' => 'boolean',
        ];
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(SmsCampaignLog::class);
    }

    public function isOneTime(): bool
    {
        return $this->schedule_type === 'one_time';
    }

    public function isDaily(): bool
    {
        return $this->schedule_type === 'daily';
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function isScheduled(): bool
    {
        return $this->status === 'scheduled';
    }

    public function isRunning(): bool
    {
        return $this->status === 'running';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isPaused(): bool
    {
        return $this->status === 'paused';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    public function canBeEnabled(): bool
    {
        return in_array($this->status, ['scheduled', 'paused', 'completed']);
    }
}
