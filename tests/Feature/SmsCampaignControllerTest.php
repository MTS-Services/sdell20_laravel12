<?php

use App\Models\SmsCampaign;
use App\Models\SmsCampaignLog;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;

// ── Access Control ──────────────────────────────────────────────

it('denies non-admin access to campaigns index', function () {
    $user = User::factory()->create(['is_admin' => false]);

    actingAs($user)
        ->get(route('admin.campaigns.index'))
        ->assertRedirect(route('dashboard'));
});

it('allows admin access to campaigns index', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->get(route('admin.campaigns.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Campaigns/Index')
            ->has('campaigns')
        );
});

it('shows the campaign create page for admin', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->get(route('admin.campaigns.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Campaigns/Create')
            ->has('senderId')
            ->has('timezone')
        );
});

// ── Validation ──────────────────────────────────────────────────

it('requires csv_file when creating a campaign', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->post(route('admin.campaigns.store'), [
            'message' => 'Test message',
            'schedule_type' => 'one_time',
            'scheduled_at' => now()->addHour()->format('Y-m-d H:i'),
        ])
        ->assertSessionHasErrors('csv_file');
});

it('requires message when creating a campaign', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $csv = UploadedFile::fake()->createWithContent('phones.csv', "+447911123456\n+447911123457");

    actingAs($admin)
        ->post(route('admin.campaigns.store'), [
            'csv_file' => $csv,
            'message' => '',
            'schedule_type' => 'one_time',
            'scheduled_at' => now()->addHour()->format('Y-m-d H:i'),
        ])
        ->assertSessionHasErrors('message');
});

it('requires schedule_type when creating a campaign', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $csv = UploadedFile::fake()->createWithContent('phones.csv', '+447911123456');

    actingAs($admin)
        ->post(route('admin.campaigns.store'), [
            'csv_file' => $csv,
            'message' => 'Test message',
        ])
        ->assertSessionHasErrors('schedule_type');
});

it('requires scheduled_at for one_time campaigns', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $csv = UploadedFile::fake()->createWithContent('phones.csv', '+447911123456');

    actingAs($admin)
        ->post(route('admin.campaigns.store'), [
            'csv_file' => $csv,
            'message' => 'Test message',
            'schedule_type' => 'one_time',
        ])
        ->assertSessionHasErrors('scheduled_at');
});

it('requires daily_time for daily campaigns', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $csv = UploadedFile::fake()->createWithContent('phones.csv', '+447911123456');

    actingAs($admin)
        ->post(route('admin.campaigns.store'), [
            'csv_file' => $csv,
            'message' => 'Test message',
            'schedule_type' => 'daily',
        ])
        ->assertSessionHasErrors('daily_time');
});

it('rejects scheduled_at in the past', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $csv = UploadedFile::fake()->createWithContent('phones.csv', '+447911123456');

    actingAs($admin)
        ->post(route('admin.campaigns.store'), [
            'csv_file' => $csv,
            'message' => 'Test message',
            'schedule_type' => 'one_time',
            'scheduled_at' => now()->subHour()->format('Y-m-d H:i'),
        ])
        ->assertSessionHasErrors('scheduled_at');
});

// ── Store — One-Time Campaign ───────────────────────────────────

it('creates a one-time campaign with valid CSV', function () {
    Queue::fake();
    $admin = User::factory()->create(['is_admin' => true]);

    $csv = UploadedFile::fake()->createWithContent(
        'phones.csv',
        "+447911123456\n+447911123457\n+447911123458"
    );

    actingAs($admin)
        ->post(route('admin.campaigns.store'), [
            'name' => 'Test One-Time',
            'csv_file' => $csv,
            'message' => 'Hello from campaign!',
            'schedule_type' => 'one_time',
            'scheduled_at' => now()->addHour()->format('Y-m-d\TH:i'),
        ])
        ->assertRedirect();

    assertDatabaseHas('sms_campaigns', [
        'admin_id' => $admin->id,
        'name' => 'Test One-Time',
        'schedule_type' => 'one_time',
        'status' => 'scheduled',
        'total_numbers' => 3,
        'pending_count' => 3,
    ]);

    expect(SmsCampaignLog::count())->toBe(3);
});

// ── Store — Daily Campaign ──────────────────────────────────────

it('creates a daily recurring campaign', function () {
    Queue::fake();
    $admin = User::factory()->create(['is_admin' => true]);

    $csv = UploadedFile::fake()->createWithContent(
        'phones.csv',
        "+447911123456\n+447911123457"
    );

    actingAs($admin)
        ->post(route('admin.campaigns.store'), [
            'name' => 'Daily Promo',
            'csv_file' => $csv,
            'message' => 'Daily message!',
            'schedule_type' => 'daily',
            'daily_time' => '21:00',
        ])
        ->assertRedirect();

    assertDatabaseHas('sms_campaigns', [
        'admin_id' => $admin->id,
        'name' => 'Daily Promo',
        'schedule_type' => 'daily',
        'daily_time' => '21:00',
        'status' => 'scheduled',
        'total_numbers' => 2,
    ]);

    $campaign = SmsCampaign::first();
    expect($campaign->next_run_at)->not->toBeNull();
});

// ── Store — CSV deduplication ───────────────────────────────────

it('deduplicates phone numbers from CSV', function () {
    Queue::fake();
    $admin = User::factory()->create(['is_admin' => true]);

    $csv = UploadedFile::fake()->createWithContent(
        'phones.csv',
        "+447911123456\n+447911123456\n+447911123457"
    );

    actingAs($admin)
        ->post(route('admin.campaigns.store'), [
            'csv_file' => $csv,
            'message' => 'Dedup test',
            'schedule_type' => 'one_time',
            'scheduled_at' => now()->addHour()->format('Y-m-d\TH:i'),
        ])
        ->assertRedirect();

    assertDatabaseHas('sms_campaigns', [
        'total_numbers' => 2,
    ]);
});

// ── Store — Invalid CSV ─────────────────────────────────────────

it('rejects CSV with no valid phone numbers', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $csv = UploadedFile::fake()->createWithContent('phones.csv', "invalid\nnot_a_number\n123");

    actingAs($admin)
        ->post(route('admin.campaigns.store'), [
            'csv_file' => $csv,
            'message' => 'Test message',
            'schedule_type' => 'one_time',
            'scheduled_at' => now()->addHour()->format('Y-m-d\TH:i'),
        ])
        ->assertSessionHasErrors('csv_file');
});

// ── Show ─────────────────────────────────────────────────────────

it('shows campaign details to the owning admin', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $campaign = SmsCampaign::factory()->for($admin, 'admin')->create();
    SmsCampaignLog::factory(3)->create(['sms_campaign_id' => $campaign->id]);

    actingAs($admin)
        ->get(route('admin.campaigns.show', $campaign))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Campaigns/Show')
            ->has('campaign')
            ->has('failedLogs')
            ->has('logs', 3)
        );
});

it('denies showing campaign to another admin', function () {
    $admin1 = User::factory()->create(['is_admin' => true]);
    $admin2 = User::factory()->create(['is_admin' => true]);
    $campaign = SmsCampaign::factory()->for($admin1, 'admin')->create();

    actingAs($admin2)
        ->get(route('admin.campaigns.show', $campaign))
        ->assertForbidden();
});

// ── Toggle ───────────────────────────────────────────────────────

it('pauses an enabled campaign', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $campaign = SmsCampaign::factory()->for($admin, 'admin')->scheduled()->create([
        'is_enabled' => true,
    ]);

    actingAs($admin)
        ->patch(route('admin.campaigns.toggle', $campaign))
        ->assertRedirect();

    $campaign->refresh();
    expect($campaign->is_enabled)->toBeFalse();
    expect($campaign->status)->toBe('paused');
});

it('re-enables a paused campaign', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $campaign = SmsCampaign::factory()->for($admin, 'admin')->paused()->create();

    actingAs($admin)
        ->patch(route('admin.campaigns.toggle', $campaign))
        ->assertRedirect();

    $campaign->refresh();
    expect($campaign->is_enabled)->toBeTrue();
    expect($campaign->status)->toBe('scheduled');
});

// ── Update Schedule ──────────────────────────────────────────────

it('updates schedule time for a one-time campaign', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $campaign = SmsCampaign::factory()->for($admin, 'admin')->scheduled()->oneTime()->create();

    $newTime = now()->addDays(2)->format('Y-m-d\TH:i');

    actingAs($admin)
        ->patch(route('admin.campaigns.update-schedule', $campaign), [
            'scheduled_at' => $newTime,
        ])
        ->assertRedirect();

    $campaign->refresh();
    expect($campaign->status)->toBe('scheduled');
    expect($campaign->scheduled_at)->not->toBeNull();
});

it('updates daily_time for a daily campaign', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $campaign = SmsCampaign::factory()->for($admin, 'admin')->scheduled()->daily()->create();

    actingAs($admin)
        ->patch(route('admin.campaigns.update-schedule', $campaign), [
            'daily_time' => '15:30',
        ])
        ->assertRedirect();

    $campaign->refresh();
    expect($campaign->daily_time)->toBe('15:30');
    expect($campaign->next_run_at)->not->toBeNull();
});

// ── Download Failed ──────────────────────────────────────────────

it('downloads failed numbers as CSV', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $campaign = SmsCampaign::factory()->for($admin, 'admin')->create();
    SmsCampaignLog::factory()->failed()->create([
        'sms_campaign_id' => $campaign->id,
        'phone_number' => '+447911123456',
    ]);

    actingAs($admin)
        ->get(route('admin.campaigns.download-failed', $campaign))
        ->assertOk()
        ->assertHeader('content-type', 'text/csv; charset=UTF-8');
});
