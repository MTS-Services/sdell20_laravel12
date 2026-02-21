<?php

use App\Models\SmsCampaign;
use App\Models\SmsCampaignLog;
use App\Models\User;
use App\Services\SmsCampaignService;
use Illuminate\Http\UploadedFile;

it('parses valid phone numbers from CSV', function () {
    $service = app(SmsCampaignService::class);

    $csv = UploadedFile::fake()->createWithContent(
        'phones.csv',
        "+8801712345678\n+8801712345679\n+8801712345680"
    );

    $numbers = $service->parsePhoneNumbersFromCsv($csv);

    expect($numbers)->toHaveCount(3)
        ->and($numbers[0])->toBe('+8801712345678');
});

it('deduplicates phone numbers', function () {
    $service = app(SmsCampaignService::class);

    $csv = UploadedFile::fake()->createWithContent(
        'phones.csv',
        "+8801712345678\n+8801712345678\n+8801712345679"
    );

    $numbers = $service->parsePhoneNumbersFromCsv($csv);

    expect($numbers)->toHaveCount(2);
});

it('skips invalid phone numbers', function () {
    $service = app(SmsCampaignService::class);

    $csv = UploadedFile::fake()->createWithContent(
        'phones.csv',
        "+8801712345678\ninvalid_number\n123\n+8801712345679"
    );

    $numbers = $service->parsePhoneNumbersFromCsv($csv);

    expect($numbers)->toHaveCount(2);
});

it('handles CSV with multiple columns', function () {
    $service = app(SmsCampaignService::class);

    $csv = UploadedFile::fake()->createWithContent(
        'phones.csv',
        "+8801712345678,John Doe\n+8801712345679,Jane Doe"
    );

    $numbers = $service->parsePhoneNumbersFromCsv($csv);

    expect($numbers)->toHaveCount(2);
});

it('handles empty CSV', function () {
    $service = app(SmsCampaignService::class);

    $csv = UploadedFile::fake()->createWithContent('phones.csv', '');

    $numbers = $service->parsePhoneNumbersFromCsv($csv);

    expect($numbers)->toBeEmpty();
});

it('creates campaign with log entries', function () {
    $service = app(SmsCampaignService::class);
    $admin = User::factory()->create(['is_admin' => true]);

    $campaign = $service->createCampaignWithLogs([
        'admin_id' => $admin->id,
        'name' => 'Test Campaign',
        'message' => 'Hello world',
        'schedule_type' => 'one_time',
        'status' => 'scheduled',
        'scheduled_at' => now()->addHour(),
    ], ['+8801712345678', '+8801712345679']);

    expect($campaign->total_numbers)->toBe(2)
        ->and($campaign->pending_count)->toBe(2)
        ->and(SmsCampaignLog::where('sms_campaign_id', $campaign->id)->count())->toBe(2);
});

it('calculates next_run_at for daily campaigns', function () {
    $service = app(SmsCampaignService::class);
    $admin = User::factory()->create(['is_admin' => true]);

    $campaign = SmsCampaign::factory()->for($admin, 'admin')->daily()->create([
        'daily_time' => '21:00',
        'timezone' => 'Asia/Dhaka',
    ]);

    $nextRun = $service->calculateNextRunAt($campaign);

    expect($nextRun)->not->toBeNull();
});

it('calculates next_run_at for one-time campaigns', function () {
    $service = app(SmsCampaignService::class);
    $admin = User::factory()->create(['is_admin' => true]);

    $scheduledAt = now()->addHours(2);
    $campaign = SmsCampaign::factory()->for($admin, 'admin')->oneTime()->create([
        'scheduled_at' => $scheduledAt,
    ]);

    $nextRun = $service->calculateNextRunAt($campaign);

    expect($nextRun->timestamp)->toBe($scheduledAt->timestamp);
});

it('resets logs for new daily run', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $campaign = SmsCampaign::factory()->for($admin, 'admin')->daily()->create([
        'sent_count' => 3,
        'failed_count' => 1,
        'pending_count' => 0,
        'total_numbers' => 4,
    ]);

    SmsCampaignLog::factory(3)->sent()->create(['sms_campaign_id' => $campaign->id]);
    SmsCampaignLog::factory(1)->failed()->create(['sms_campaign_id' => $campaign->id]);

    $service = app(SmsCampaignService::class);
    $service->resetLogsForNewRun($campaign);

    $campaign->refresh();
    expect($campaign->sent_count)->toBe(0)
        ->and($campaign->failed_count)->toBe(0)
        ->and($campaign->pending_count)->toBe(4)
        ->and(SmsCampaignLog::where('sms_campaign_id', $campaign->id)->where('status', 'pending')->count())->toBe(4);
});
