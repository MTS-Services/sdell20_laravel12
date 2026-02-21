<?php

use App\Models\ScheduledSms;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

uses(RefreshDatabase::class);

it('shows scheduled sms index page for authenticated user', function () {
    /** @var User $user */
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('sms.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Sms/Index')
            ->has('messages')
        );
});

it('shows create sms page', function () {
    /** @var User $user */
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('sms.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Sms/Create'));
});

it('creates a scheduled sms with valid data', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $scheduledTime = now()->addHours(2);

    actingAs($user)
        ->post(route('sms.store'), [
            'to_phone' => '+8801712345678',
            'message' => 'Test SMS message',
            'scheduled_at' => $scheduledTime->format('Y-m-d\TH:i'),
        ])
        ->assertRedirect(route('sms.index'))
        ->assertSessionHas('success');

    assertDatabaseHas('scheduled_sms', [
        'user_id' => $user->id,
        'to_phone' => '+8801712345678',
        'message' => 'Test SMS message',
        'status' => 'pending',
    ]);
});

it('validates phone number format', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $scheduledTime = now()->addHours(2);

    actingAs($user)
        ->post(route('sms.store'), [
            'to_phone' => '01712345678', // Invalid: no +88 prefix
            'message' => 'Test SMS message',
            'scheduled_at' => $scheduledTime->format('Y-m-d\TH:i'),
        ])
        ->assertSessionHasErrors('to_phone');
});

it('validates message is required', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $scheduledTime = now()->addHours(2);

    actingAs($user)
        ->post(route('sms.store'), [
            'to_phone' => '+8801712345678',
            'message' => '',
            'scheduled_at' => $scheduledTime->format('Y-m-d\TH:i'),
        ])
        ->assertSessionHasErrors('message');
});

it('validates scheduled time must be in future', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $pastTime = now()->subHour();

    actingAs($user)
        ->post(route('sms.store'), [
            'to_phone' => '+8801712345678',
            'message' => 'Test SMS message',
            'scheduled_at' => $pastTime->format('Y-m-d\TH:i'),
        ])
        ->assertSessionHasErrors('scheduled_at');
});

it('user can only view their own scheduled sms', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    ScheduledSms::factory()->create(['user_id' => $otherUser->id]);
    $ownSms = ScheduledSms::factory()->create(['user_id' => $user->id]);

    actingAs($user)
        ->get(route('sms.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Sms/Index')
            ->has('messages.data', 1)
            ->where('messages.data.0.id', $ownSms->id)
        );
});

it('user can cancel a pending sms', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $sms = ScheduledSms::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
    ]);

    actingAs($user)
        ->delete(route('sms.destroy', $sms))
        ->assertRedirect();

    expect($sms->fresh()->status)->toBe('cancelled');
});

it('user cannot cancel a sent sms', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $sms = ScheduledSms::factory()->create([
        'user_id' => $user->id,
        'status' => 'sent',
    ]);

    actingAs($user)
        ->delete(route('sms.destroy', $sms))
        ->assertStatus(422);
});

it('user cannot delete another users sms', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $sms = ScheduledSms::factory()->create([
        'user_id' => $otherUser->id,
        'status' => 'pending',
    ]);

    actingAs($user)
        ->delete(route('sms.destroy', $sms))
        ->assertStatus(403);
});

it('requires authentication to view sms pages', function () {
    get(route('sms.index'))->assertRedirect(route('login'));
    get(route('sms.create'))->assertRedirect(route('login'));
    post(route('sms.store'), [])->assertRedirect(route('login'));
});

it('rate limits sms creation to 20 per minute', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $scheduledTime = now()->addHours(2);

    // Try to create 21 SMS messages
    for ($i = 0; $i < 21; $i++) {
        $response = actingAs($user)
            ->post(route('sms.store'), [
                'to_phone' => "+880171234567{$i}",
                'message' => "Test SMS {$i}",
                'scheduled_at' => $scheduledTime->format('Y-m-d\TH:i'),
            ]);

        if ($i < 20) {
            expect($response->getStatusCode())->toBeLessThan(429);
        } else {
            expect($response->getStatusCode())->toBe(429);
        }
    }
});
