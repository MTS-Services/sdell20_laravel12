<?php

use App\Models\Lpa;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('redirects unpaid users from thank you to the lpa show page', function (): void {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $lpa = Lpa::query()->create([
        'user_id' => $user->id,
        'who_for' => 'Me',
        'document_type' => 'health',
        'status' => 'draft',
        'is_draft' => true,
        'donor_details' => ['firstName' => 'A', 'lastName' => 'B'],
        'contact_details' => ['email' => 'a@b.com'],
        'amount' => 194.00,
        'paid_at' => null,
    ]);

    $this->actingAs($user)
        ->get(route('lpas.thank-you', $lpa))
        ->assertRedirect(route('lpas.show', $lpa));
});

it('shows the thank you page when the lpa is paid', function (): void {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $lpa = Lpa::query()->create([
        'user_id' => $user->id,
        'who_for' => 'Me',
        'document_type' => 'health',
        'status' => 'completed',
        'is_draft' => false,
        'donor_details' => ['firstName' => 'A', 'lastName' => 'B'],
        'contact_details' => ['email' => 'a@b.com'],
        'amount' => 194.00,
        'paid_at' => now(),
        'payment_reference' => 'pi_test',
    ]);

    $this->actingAs($user)
        ->get(route('lpas.thank-you', $lpa))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/User/LpaThankYou')
            ->has('lpa')
            ->has('supportEmail'));
});
