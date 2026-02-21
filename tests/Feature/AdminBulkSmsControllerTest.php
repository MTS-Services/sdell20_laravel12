<?php

use App\Jobs\ProcessBulkSmsSendJob;
use App\Models\BulkSmsSend;
use App\Models\SmsSendLog;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

it('denies non-admin access to bulk sms index', function () {
    /** @var User $user */
    $user = User::factory()->create(['is_admin' => false]);

    actingAs($user)
        ->get(route('admin.bulk-sms.index'))
        ->assertRedirect(route('dashboard'));
});

it('allows admin access to bulk sms index', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->get(route('admin.bulk-sms.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/BulkSms/Index')
            ->has('sends')
        );
});

it('shows the bulk sms create page for admin', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->get(route('admin.bulk-sms.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('backend/Admin/BulkSms/Create'));
});

it('requires message in bulk sms form', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->post(route('admin.bulk-sms.store'), [
            'message' => '',
            'manual_phone' => '+8801712345678',
        ])
        ->assertSessionHasErrors('message');
});

it('requires csv or manual phone number', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->post(route('admin.bulk-sms.store'), [
            'message' => 'Test message',
        ])
        ->assertSessionHasErrors('csv_file');
});

it('validates manual phone number format', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->post(route('admin.bulk-sms.store'), [
            'message' => 'Test message',
            'manual_phone' => '0171invalid',
        ])
        ->assertSessionHasErrors('manual_phone');
});

it('sends bulk sms with manual phone number', function () {
    Queue::fake();

    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->post(route('admin.bulk-sms.store'), [
            'message' => 'Hello from bulk SMS!',
            'manual_phone' => '+8801712345678',
        ])
        ->assertRedirect();

    assertDatabaseHas('bulk_sms_sends', [
        'admin_id' => $admin->id,
        'message' => 'Hello from bulk SMS!',
        'total_numbers' => 1,
        'status' => 'pending',
    ]);

    assertDatabaseHas('sms_send_logs', [
        'phone_number' => '+8801712345678',
        'message' => 'Hello from bulk SMS!',
        'status' => 'pending',
        'created_by' => $admin->id,
    ]);

    Queue::assertPushed(ProcessBulkSmsSendJob::class);
});

it('sends bulk sms with csv file', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    $csvContent = "+8801711111111\n+8801722222222\n+8801733333333\ninvalid_number\n+8801711111111";
    $csvFile = UploadedFile::fake()->createWithContent('phones.csv', $csvContent);

    actingAs($admin)
        ->post(route('admin.bulk-sms.store'), [
            'message' => 'CSV bulk test',
            'csv_file' => $csvFile,
        ])
        ->assertRedirect();

    // Should have 3 unique valid numbers (duplicate +8801711111111 removed, invalid_number skipped)
    assertDatabaseHas('bulk_sms_sends', [
        'admin_id' => $admin->id,
        'total_numbers' => 3,
        'csv_filename' => 'phones.csv',
    ]);

    expect(SmsSendLog::count())->toBe(3);
});

it('sends bulk sms with csv and manual phone combined', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    $csvContent = "+8801711111111\n+8801722222222";
    $csvFile = UploadedFile::fake()->createWithContent('phones.csv', $csvContent);

    actingAs($admin)
        ->post(route('admin.bulk-sms.store'), [
            'message' => 'Combined test',
            'csv_file' => $csvFile,
            'manual_phone' => '+8801799999999',
        ])
        ->assertRedirect();

    assertDatabaseHas('bulk_sms_sends', [
        'total_numbers' => 3, // 2 from CSV + 1 manual
    ]);
});

it('deduplicates manual phone if also in csv', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    $csvContent = "+8801711111111\n+8801722222222";
    $csvFile = UploadedFile::fake()->createWithContent('phones.csv', $csvContent);

    actingAs($admin)
        ->post(route('admin.bulk-sms.store'), [
            'message' => 'Dedup test',
            'csv_file' => $csvFile,
            'manual_phone' => '+8801711111111', // Already in CSV
        ])
        ->assertRedirect();

    assertDatabaseHas('bulk_sms_sends', [
        'total_numbers' => 2, // Deduplicated
    ]);
});

it('rejects csv with no valid phone numbers', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    $csvContent = "invalid1\ninvalid2\nnot_a_phone";
    $csvFile = UploadedFile::fake()->createWithContent('bad.csv', $csvContent);

    actingAs($admin)
        ->post(route('admin.bulk-sms.store'), [
            'message' => 'Bad CSV test',
            'csv_file' => $csvFile,
        ])
        ->assertSessionHasErrors('csv_file');
});

it('shows bulk sms detail page with logs', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    $bulkSend = BulkSmsSend::factory()->create([
        'admin_id' => $admin->id,
    ]);

    SmsSendLog::factory()->count(3)->create([
        'bulk_sms_send_id' => $bulkSend->id,
        'created_by' => $admin->id,
    ]);

    actingAs($admin)
        ->get(route('admin.bulk-sms.show', $bulkSend))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/BulkSms/Show')
            ->has('bulkSend')
            ->has('logs', 3)
            ->has('failedLogs')
        );
});

it('prevents admin from viewing another admins bulk send', function () {
    /** @var User $admin1 */
    $admin1 = User::factory()->create(['is_admin' => true]);
    /** @var User $admin2 */
    $admin2 = User::factory()->create(['is_admin' => true]);

    $bulkSend = BulkSmsSend::factory()->create([
        'admin_id' => $admin1->id,
    ]);

    actingAs($admin2)
        ->get(route('admin.bulk-sms.show', $bulkSend))
        ->assertForbidden();
});

it('requires authentication to access bulk sms', function () {
    get(route('admin.bulk-sms.index'))->assertRedirect(route('login'));
    get(route('admin.bulk-sms.create'))->assertRedirect(route('login'));
    post(route('admin.bulk-sms.store'), [])->assertRedirect(route('login'));
});

it('handles csv with header row correctly', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    $csvContent = "phone,name\n+8801711111111,John\n+8801722222222,Jane";
    $csvFile = UploadedFile::fake()->createWithContent('with_header.csv', $csvContent);

    actingAs($admin)
        ->post(route('admin.bulk-sms.store'), [
            'message' => 'Header CSV test',
            'csv_file' => $csvFile,
        ])
        ->assertRedirect();

    assertDatabaseHas('bulk_sms_sends', [
        'total_numbers' => 2,
    ]);
});
