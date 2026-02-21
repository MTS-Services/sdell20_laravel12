<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $sms_campaign_id
 * @property string $phone_number
 * @property string $message
 * @property string $status
 * @property string|null $provider_message_id
 * @property string|null $provider_response
 * @property string|null $error_reason
 * @property \Illuminate\Support\Carbon|null $sent_at
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class SmsCampaignLog extends Model
{
    /** @use HasFactory<\Database\Factories\SmsCampaignLogFactory> */
    use HasFactory;

    protected $fillable = [
        'sms_campaign_id',
        'phone_number',
        'message',
        'status',
        'provider_message_id',
        'provider_response',
        'error_reason',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
        ];
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(SmsCampaign::class, 'sms_campaign_id');
    }
}
