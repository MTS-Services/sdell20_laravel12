<?php

namespace App\Console\Commands;

use App\Jobs\ProcessSmsCampaignJob;
use App\Models\SmsCampaign;
use App\Services\SmsCampaignService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class DispatchDueCampaignsCommand extends Command
{
    protected $signature = 'campaigns:dispatch-due';

    protected $description = 'Dispatch due SMS campaigns for processing';

    public function handle(SmsCampaignService $campaignService): int
    {
        // Find scheduled, enabled campaigns whose next_run_at is in the past
        $dueCampaigns = SmsCampaign::query()
            ->where('status', 'scheduled')
            ->where('is_enabled', true)
            ->whereNotNull('next_run_at')
            ->where('next_run_at', '<=', now())
            ->limit(50)
            ->get();

        if ($dueCampaigns->isEmpty()) {
            $this->components->info('No due campaigns found.');

            return self::SUCCESS;
        }

        foreach ($dueCampaigns as $campaign) {
            /** @var SmsCampaign $campaign */

            // For daily recurring, reset logs for the new run
            if ($campaign->isDaily()) {
                $campaignService->resetLogsForNewRun($campaign);
            }

            ProcessSmsCampaignJob::dispatch($campaign->id)->onQueue('sms');

            $this->components->info("Dispatched campaign #{$campaign->id}: {$campaign->name}");

            Log::channel('clicksend')->info("Campaign #{$campaign->id} dispatched by scheduler", [
                'schedule_type' => $campaign->schedule_type,
                'next_run_at' => $campaign->next_run_at,
            ]);
        }

        $this->components->info("Dispatched {$dueCampaigns->count()} campaign(s).");

        return self::SUCCESS;
    }
}
