<?php

use App\Models\User;

use function Pest\Laravel\actingAs;

it('denies non-admin access to sms logs', function () {
    /** @var User $user */
    $user = User::factory()->create(['is_admin' => false]);

    actingAs($user)
        ->get(route('admin.sms-logs.index'))
        ->assertRedirect(route('dashboard'));
});

it('allows admin access to sms logs index', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->get(route('admin.sms-logs.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/SmsLogs/Index')
            ->has('entries')
            ->has('filters')
            ->has('availableDates')
            ->has('summary')
        );
});

it('returns summary with correct keys', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->get(route('admin.sms-logs.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('summary.total')
            ->has('summary.success')
            ->has('summary.outbound')
            ->has('summary.errors')
        );
});

it('accepts date filter parameter', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->get(route('admin.sms-logs.index', ['date' => '2026-01-01']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('filters.date', '2026-01-01')
        );
});

it('accepts level filter parameter', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->get(route('admin.sms-logs.index', ['level' => 'error']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('filters.level', 'error')
        );
});

it('defaults to today date and all level filter', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->get(route('admin.sms-logs.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('filters.date', now()->format('Y-m-d'))
            ->where('filters.level', 'all')
        );
});

it('parses log entries from a real log file', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    $date = now()->format('Y-m-d');
    $logFile = storage_path("logs/clicksend-{$date}.log");
    $existed = file_exists($logFile);
    $originalContent = $existed ? file_get_contents($logFile) : null;

    // Write a test log entry
    file_put_contents($logFile, "[{$date} 10:00:00] testing.INFO: ClickSend SMS outbound {\"to\":\"+447911123456\",\"message_length\":12}\n", FILE_APPEND);
    file_put_contents($logFile, "[{$date} 10:00:01] testing.INFO: ClickSend SMS accepted {\"to\":\"+447911123456\",\"message_id\":\"abc123\"}\n", FILE_APPEND);
    file_put_contents($logFile, "[{$date} 10:00:02] testing.ERROR: ClickSend API error {\"status\":500}\n", FILE_APPEND);

    actingAs($admin)
        ->get(route('admin.sms-logs.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('summary.total', fn ($total) => $total >= 3)
        );

    // Cleanup
    if ($existed && $originalContent !== null) {
        file_put_contents($logFile, $originalContent);
    } elseif (! $existed) {
        unlink($logFile);
    }
});

it('returns empty entries when no log file exists for date', function () {
    /** @var User $admin */
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->get(route('admin.sms-logs.index', ['date' => '1999-01-01']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('entries', [])
            ->where('summary.total', 0)
        );
});
