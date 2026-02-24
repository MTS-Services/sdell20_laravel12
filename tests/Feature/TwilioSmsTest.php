<?php

use App\Models\BulkSmsCampaign;
use App\Models\SmsLog;
use App\Models\User;
use App\Services\TwilioService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['is_admin' => true]);
    $this->user = User::factory()->create(['is_admin' => false]);
});

// ── Page Access Tests ──────────────────────────────────────

it('allows admin to view twilio index page', function () {
    $this->actingAs($this->admin)
        ->get(route('admin.twilio.index'))
        ->assertSuccessful();
});

it('allows admin to view bulk sms page', function () {
    $this->actingAs($this->admin)
        ->get(route('admin.twilio.bulk.index'))
        ->assertSuccessful();
});

it('prevents non-admin from accessing twilio pages', function () {
    $this->actingAs($this->user)
        ->get(route('admin.twilio.index'))
        ->assertRedirect();
});

it('redirects guests to login for twilio pages', function () {
    $this->get(route('admin.twilio.index'))
        ->assertRedirect();
});

// ── Campaign Detail Page ────────────────────────────────────

it('allows admin to view campaign detail page', function () {
    $campaign = BulkSmsCampaign::factory()->create();

    $this->actingAs($this->admin)
        ->get(route('admin.twilio.campaign.show', $campaign->id))
        ->assertSuccessful();
});

it('returns 404 for non-existent campaign', function () {
    $this->actingAs($this->admin)
        ->get(route('admin.twilio.campaign.show', 99999))
        ->assertNotFound();
});

// ── Campaign Status API ─────────────────────────────────────

it('returns campaign status as json', function () {
    $campaign = BulkSmsCampaign::factory()->processing()->create([
        'total_recipients' => 100,
        'sent_count' => 40,
        'failed_count' => 10,
    ]);

    $this->actingAs($this->admin)
        ->getJson(route('admin.twilio.campaign.status', $campaign->id))
        ->assertSuccessful()
        ->assertJsonStructure([
            'id', 'status', 'total_recipients', 'sent_count', 'failed_count', 'progress_percentage',
        ])
        ->assertJson([
            'status' => 'processing',
            'total_recipients' => 100,
            'sent_count' => 40,
            'failed_count' => 10,
            'progress_percentage' => 50,
        ]);
});

// ── CSV Template Download ───────────────────────────────────

it('allows admin to download csv template', function () {
    $this->actingAs($this->admin)
        ->get(route('admin.twilio.csvTemplate'))
        ->assertSuccessful()
        ->assertHeader('Content-Type', 'text/csv; charset=utf-8');
});

// ── SMS Validation Tests ────────────────────────────────────

it('validates phone number when sending sms', function () {
    $this->actingAs($this->admin)
        ->post(route('admin.twilio.sendSms'), [
            'phone' => '',
            'message' => 'Hello!',
        ])
        ->assertSessionHasErrors('phone');
});

it('validates message when sending sms', function () {
    $this->actingAs($this->admin)
        ->post(route('admin.twilio.sendSms'), [
            'phone' => '+447911123456',
            'message' => '',
        ])
        ->assertSessionHasErrors('message');
});

// ── Bulk SMS Validation Tests ───────────────────────────────

it('validates bulk csv upload fields', function () {
    $this->actingAs($this->admin)
        ->post(route('admin.twilio.bulk.uploadCsv'), [
            'campaign_name' => '',
            'message' => '',
        ])
        ->assertSessionHasErrors(['campaign_name', 'message', 'csv_file']);
});

it('validates bulk manual fields', function () {
    $this->actingAs($this->admin)
        ->post(route('admin.twilio.bulk.manual'), [
            'campaign_name' => '',
            'message' => '',
            'phone_numbers' => '',
        ])
        ->assertSessionHasErrors(['campaign_name', 'message', 'phone_numbers']);
});

// ── Model Tests ─────────────────────────────────────────────

it('calculates progress percentage correctly', function () {
    $campaign = BulkSmsCampaign::factory()->create([
        'total_recipients' => 200,
        'sent_count' => 100,
        'failed_count' => 50,
    ]);

    expect($campaign->progress_percentage)->toBe(75);
});

it('returns zero progress for empty campaign', function () {
    $campaign = BulkSmsCampaign::factory()->create([
        'total_recipients' => 0,
        'sent_count' => 0,
        'failed_count' => 0,
    ]);

    expect($campaign->progress_percentage)->toBe(0);
});

it('can create sms log entries', function () {
    $log = SmsLog::factory()->sent()->create();

    expect($log->status)->toBe('sent')
        ->and($log->type)->toBe('single');
});

it('relates sms logs to campaigns', function () {
    $campaign = BulkSmsCampaign::factory()->create();
    $log = SmsLog::factory()->bulk()->create([
        'bulk_campaign_id' => $campaign->id,
    ]);

    expect($log->campaign->id)->toBe($campaign->id)
        ->and($campaign->logs)->toHaveCount(1);
});

// ── TwilioService Unit Tests ────────────────────────────────

it('formats bangladesh numbers correctly', function () {
    $service = new TwilioService;

    expect($service->formatNumber('01711123456'))->toBe('+88001711123456');
});

it('formats uk numbers correctly', function () {
    $service = new TwilioService;

    expect($service->formatNumber('07911123456'))->toBe('+447911123456');
});

it('preserves numbers already in e164 format', function () {
    $service = new TwilioService;

    expect($service->formatNumber('+447911123456'))->toBe('+447911123456');
});

// ── Webhook Test ────────────────────────────────────────────

it('accepts incoming webhook and creates sms log', function () {
    $this->post(route('twilio.webhook'), [
        'From' => '+447911123456',
        'To' => '+447911654321',
        'Body' => 'Test incoming message',
    ])
        ->assertSuccessful()
        ->assertHeader('Content-Type', 'text/xml; charset=UTF-8');

    $this->assertDatabaseHas('sms_logs', [
        'from' => '+447911123456',
        'to' => '+447911654321',
        'message' => 'Test incoming message',
        'status' => 'received',
        'type' => 'incoming',
    ]);
});
