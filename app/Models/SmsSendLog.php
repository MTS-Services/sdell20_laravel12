<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $bulk_sms_send_id
 * @property string $phone_number
 * @property string $message
 * @property string $status
 * @property string|null $provider_message_id
 * @property string|null $provider_response
 * @property string|null $error_reason
 * @property int $created_by
 * @property \Illuminate\Support\Carbon|null $sent_at
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class SmsSendLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'bulk_sms_send_id',
        'phone_number',
        'message',
        'status',
        'provider_message_id',
        'provider_response',
        'error_reason',
        'created_by',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
        ];
    }

    public function bulkSmsSend(): BelongsTo
    {
        return $this->belongsTo(BulkSmsSend::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
