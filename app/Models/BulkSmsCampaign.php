<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BulkSmsCampaign extends Model
{
    /** @use HasFactory<\Database\Factories\BulkSmsCampaignFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'message',
        'csv_file_path',
        'total_recipients',
        'sent_count',
        'failed_count',
        'status',
        'created_by',
        'started_at',
        'completed_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function logs(): HasMany
    {
        return $this->hasMany(SmsLog::class, 'bulk_campaign_id');
    }

    public function getProgressPercentageAttribute(): int
    {
        if ($this->total_recipients === 0) {
            return 0;
        }

        return (int) (($this->sent_count + $this->failed_count) / $this->total_recipients * 100);
    }
}
