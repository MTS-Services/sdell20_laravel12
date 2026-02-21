<?php

use App\Jobs\ProcessSmsCampaignJob;
use App\Models\SmsCampaign;
use App\Models\SmsCampaignLog;
use App\Models\User;
use Illuminate\Support\Facades\Queue;

it('dispatches jobs for due campaigns', function () {
    Queue::fake();

    $admin = User::factory()->create(['is_admin' => true]);

    // Campaign due 5 minutes ago
    $dueCampaign = SmsCampaign::factory()->for($admin, 'admin')->create([
        'status' => 'scheduled',
        'is_enabled' => true,
        'schedule_type' => 'one_time',
        'next_run_at' => now()->subMinutes(5),
    ]);
    SmsCampaignLog::factory(2)->create(['sms_campaign_id' => $dueCampaign->id]);

    // Campaign due in the future (should not dispatch)
    SmsCampaign::factory()->for($admin, 'admin')->create([
        'status' => 'scheduled',
        'is_enabled' => true,
        'next_run_at' => now()->addHour(),
    ]);

    $this->artisan('campaigns:dispatch-due')
        ->assertSuccessful();

    Queue::assertPushed(ProcessSmsCampaignJob::class, 1);
});

it('does not dispatch disabled campaigns', function () {
    Queue::fake();

    $admin = User::factory()->create(['is_admin' => true]);

    SmsCampaign::factory()->for($admin, 'admin')->create([
        'status' => 'scheduled',
        'is_enabled' => false,
        'next_run_at' => now()->subMinutes(5),
    ]);

    $this->artisan('campaigns:dispatch-due')
        ->assertSuccessful();

    Queue::assertNotPushed(ProcessSmsCampaignJob::class);
});

it('does not dispatch campaigns with null next_run_at', function () {
    Queue::fake();

    $admin = User::factory()->create(['is_admin' => true]);

    SmsCampaign::factory()->for($admin, 'admin')->create([
        'status' => 'scheduled',
        'is_enabled' => true,
        'next_run_at' => null,
    ]);

    $this->artisan('campaigns:dispatch-due')
        ->assertSuccessful();

    Queue::assertNotPushed(ProcessSmsCampaignJob::class);
});

it('resets logs for daily campaigns before dispatch', function () {
    Queue::fake();

    $admin = User::factory()->create(['is_admin' => true]);

    $campaign = SmsCampaign::factory()->for($admin, 'admin')->daily()->create([
        'status' => 'scheduled',
        'is_enabled' => true,
        'next_run_at' => now()->subMinutes(5),
        'sent_count' => 5,
        'failed_count' => 1,
        'pending_count' => 0,
    ]);

    SmsCampaignLog::factory(3)->sent()->create([
        'sms_campaign_id' => $campaign->id,
    ]);

    $this->artisan('campaigns:dispatch-due')
        ->assertSuccessful();

    $campaign->refresh();
    expect($campaign->pending_count)->toBe($campaign->total_numbers);
    expect($campaign->sent_count)->toBe(0);
    expect(SmsCampaignLog::where('sms_campaign_id', $campaign->id)->where('status', 'pending')->count())->toBe(3);

    Queue::assertPushed(ProcessSmsCampaignJob::class, 1);
});
