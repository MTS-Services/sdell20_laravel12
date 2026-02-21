<?php

use App\Exceptions\ClickSendException;
use App\Jobs\ProcessSmsCampaignJob;
use App\Models\SmsCampaign;
use App\Models\SmsCampaignLog;
use App\Models\User;
use App\Services\ClickSendSmsService;

it('processes all pending logs in a campaign', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $campaign = SmsCampaign::factory()->for($admin, 'admin')->scheduled()->create();

    SmsCampaignLog::factory(3)->create([
        'sms_campaign_id' => $campaign->id,
        'status' => 'pending',
    ]);

    $mock = $this->mock(ClickSendSmsService::class);
    $mock->shouldReceive('send')
        ->times(3)
        ->andReturn(['message_id' => 'msg_123', 'status' => 'SUCCESS', 'status_code' => 200]);

    (new ProcessSmsCampaignJob($campaign->id))->handle($mock, app(\App\Services\SmsCampaignService::class));

    $campaign->refresh();
    expect($campaign->status)->toBe('completed');
    expect($campaign->sent_count)->toBe(3);
    expect($campaign->failed_count)->toBe(0);
    expect(SmsCampaignLog::where('status', 'sent')->count())->toBe(3);
});

it('marks failed logs and campaign appropriately', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $campaign = SmsCampaign::factory()->for($admin, 'admin')->scheduled()->create();

    SmsCampaignLog::factory(2)->create([
        'sms_campaign_id' => $campaign->id,
        'status' => 'pending',
    ]);

    $mock = $this->mock(ClickSendSmsService::class);
    $mock->shouldReceive('send')
        ->times(2)
        ->andThrow(new ClickSendException('Invalid recipient'));

    (new ProcessSmsCampaignJob($campaign->id))->handle($mock, app(\App\Services\SmsCampaignService::class));

    $campaign->refresh();
    expect($campaign->status)->toBe('failed');
    expect($campaign->failed_count)->toBe(2);
    expect(SmsCampaignLog::where('status', 'failed')->count())->toBe(2);
});

it('skips disabled campaigns', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $campaign = SmsCampaign::factory()->for($admin, 'admin')->create([
        'status' => 'scheduled',
        'is_enabled' => false,
    ]);

    SmsCampaignLog::factory(2)->create([
        'sms_campaign_id' => $campaign->id,
        'status' => 'pending',
    ]);

    $mock = $this->mock(ClickSendSmsService::class);
    $mock->shouldNotReceive('send');

    (new ProcessSmsCampaignJob($campaign->id))->handle($mock, app(\App\Services\SmsCampaignService::class));

    $campaign->refresh();
    expect($campaign->status)->toBe('scheduled');
});

it('handles non-existent campaign gracefully', function () {
    $mock = $this->mock(ClickSendSmsService::class);
    $mock->shouldNotReceive('send');

    (new ProcessSmsCampaignJob(99999))->handle($mock, app(\App\Services\SmsCampaignService::class));

    // No exception thrown
    expect(true)->toBeTrue();
});

it('keeps daily campaign as scheduled after run', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $campaign = SmsCampaign::factory()->for($admin, 'admin')->scheduled()->daily()->create();

    SmsCampaignLog::factory(2)->create([
        'sms_campaign_id' => $campaign->id,
        'status' => 'pending',
    ]);

    $mock = $this->mock(ClickSendSmsService::class);
    $mock->shouldReceive('send')
        ->times(2)
        ->andReturn(['message_id' => 'msg_123', 'status' => 'SUCCESS', 'status_code' => 200]);

    (new ProcessSmsCampaignJob($campaign->id))->handle($mock, app(\App\Services\SmsCampaignService::class));

    $campaign->refresh();
    expect($campaign->status)->toBe('scheduled');
    expect($campaign->next_run_at)->not->toBeNull();
});
