<?php

use App\Mail\LpaCompletedAdminEmail;
use App\Mail\LpaCompletedEmail;
use App\Models\Lpa;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

it('stores a health lpa with full answers and returns checkout metadata', function (): void {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $payload = [
        'who_for' => 'Me',
        'document_type' => 'health',
        'donor_details' => [
            'title' => 'Ms',
            'firstName' => 'Jane',
            'lastName' => 'Doe',
            'middleNames' => '',
            'birthDay' => '1',
            'birthMonth' => '1',
            'birthYear' => '1980',
        ],
        'contact_details' => [
            'addressLine1' => '1 Main St',
            'town' => 'London',
            'postcode' => 'SW1A 1AA',
            'email' => 'jane@example.com',
        ],
        'attorneys' => [[
            'title' => 'Mr',
            'firstName' => 'John',
            'lastName' => 'Agent',
            'middleNames' => '',
            'postcode' => 'SW1A 2AA',
            'addressLine1' => '2 Side St',
            'addressLine2' => '',
            'town' => 'London',
            'county' => '',
            'birthDay' => '2',
            'birthMonth' => '2',
            'birthYear' => '1970',
            'email' => 'john@example.com',
        ]],
        'can_view_documents' => true,
        'replacement_attorneys' => [],
        'want_replacement_attorneys' => false,
        'life_sustaining_treatment' => true,
        'notify_people' => false,
        'applicant' => 'donor',
        'document_recipient' => 'donor',
        'certificate_choice' => true,
        'lp1h_form' => [
            'attorney_acting' => 'jointly_and_severally',
            'preferences' => 'Prefer care near family.',
            'instructions' => null,
            'people_to_notify' => [],
            'complete_signatures_on_paper' => true,
        ],
    ];

    $response = $this->actingAs($user)->postJson(route('lpas.store'), $payload);

    $response->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.checkout_product', 'lpa_health');

    $response->assertJsonStructure([
        'data' => [
            'lpa_id',
            'checkout_amount_pence',
            'checkout_product',
        ],
    ]);

    $lpa = Lpa::query()->firstOrFail();
    expect($lpa->document_type)->toBe('health');
    expect($lpa->attorneys)->toHaveCount(1);
    expect($lpa->life_sustaining_treatment)->toBeTrue();
    expect($lpa->lp1h_form['attorney_acting'] ?? null)->toBe('jointly_and_severally');
});

it('stores a property lpa with LP1F section 5 timing in lp1h_form', function (): void {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $payload = [
        'who_for' => 'Me',
        'document_type' => 'property',
        'donor_details' => [
            'title' => 'Mr',
            'firstName' => 'Pat',
            'lastName' => 'Smith',
            'middleNames' => '',
            'birthDay' => '10',
            'birthMonth' => '11',
            'birthYear' => '1965',
        ],
        'contact_details' => [
            'addressLine1' => '9 Bank Rd',
            'town' => 'Manchester',
            'postcode' => 'M1 1AA',
            'email' => 'pat@example.com',
        ],
        'attorneys' => [[
            'title' => 'Ms',
            'firstName' => 'Alex',
            'lastName' => 'Lee',
            'middleNames' => '',
            'postcode' => 'M2 2BB',
            'addressLine1' => '1 Lane',
            'addressLine2' => '',
            'town' => 'Manchester',
            'county' => '',
            'birthDay' => '1',
            'birthMonth' => '2',
            'birthYear' => '1988',
            'email' => 'alex@example.com',
        ]],
        'can_view_documents' => true,
        'replacement_attorneys' => [],
        'want_replacement_attorneys' => false,
        'life_sustaining_treatment' => null,
        'notify_people' => false,
        'applicant' => 'donor',
        'document_recipient' => 'donor',
        'certificate_choice' => false,
        'lp1h_form' => [
            'attorney_acting' => 'jointly_and_severally',
            'when_attorneys_can_act' => 'as_soon_registered',
            'complete_signatures_on_paper' => true,
        ],
    ];

    $response = $this->actingAs($user)->postJson(route('lpas.store'), $payload);

    $response->assertCreated()->assertJsonPath('data.checkout_product', 'lpa_property');

    $lpa = Lpa::query()->firstOrFail();
    expect($lpa->document_type)->toBe('property');
    expect($lpa->lp1h_form['when_attorneys_can_act'] ?? null)->toBe('as_soon_registered');
});

it('queues customer and admin lpa completion mailables when an lpa is marked paid', function (): void {
    Mail::fake();

    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $lpa = Lpa::query()->create([
        'user_id' => $user->id,
        'who_for' => 'Me',
        'document_type' => 'health',
        'status' => 'draft',
        'is_draft' => true,
        'donor_details' => ['firstName' => 'Jane', 'lastName' => 'Doe'],
        'contact_details' => ['email' => 'jane@example.com'],
        'amount' => 194.00,
    ]);

    $lpa->markAsPaid('pi_test_123');

    Mail::assertQueued(LpaCompletedEmail::class);
    Mail::assertQueued(LpaCompletedAdminEmail::class);
});
