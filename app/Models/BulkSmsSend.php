<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $admin_id
 * @property string $message
 * @property int $total_numbers
 * @property int $sent_count
 * @property int $failed_count
 * @property int $pending_count
 * @property string $status
 * @property string|null $csv_filename
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class BulkSmsSend extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'message',
        'total_numbers',
        'sent_count',
        'failed_count',
        'pending_count',
        'status',
        'csv_filename',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(SmsSendLog::class);
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isProcessing(): bool
    {
        return $this->status === 'processing';
    }
}
