<?php

namespace App\Console\Commands;

use App\Jobs\SendScheduledSmsJob;
use App\Models\ScheduledSms;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DispatchDueSmsCommand extends Command
{
    protected $signature = 'sms:dispatch-due';

    protected $description = 'Dispatch jobs for all SMS messages due for sending';

    public function handle(): int
    {
        $due = ScheduledSms::query()
            ->where('status', 'pending')
            ->where('scheduled_at', '<=', now())
            ->where('attempts', '<', DB::raw('max_attempts'))
            ->orderBy('scheduled_at')
            ->limit(200)
            ->get();

        $this->info("Found {$due->count()} due SMS messages.");

        foreach ($due as $sms) {
            SendScheduledSmsJob::dispatch($sms->id)->onQueue('sms');
            $this->line("  → Dispatched ScheduledSms #{$sms->id} to {$sms->to_phone}");
        }

        return Command::SUCCESS;
    }
}
