<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SmsLog extends Model
{
    /** @use HasFactory<\Database\Factories\SmsLogFactory> */
    use HasFactory;

    protected $fillable = [
        'to',
        'from',
        'message',
        'status',
        'twilio_sid',
        'type',
        'bulk_campaign_id',
        'error_message',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(BulkSmsCampaign::class, 'bulk_campaign_id');
    }
}
