<?php

use App\Mail\LpaCompletedAdminEmail;
use App\Models\Lpa;
use App\Models\User;
use App\Support\LpaAdminEmailSummary;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('builds ordered summary sections including donor attorneys and lp1h_form', function (): void {
    $user = User::factory()->create([
        'name' => 'Admin Test User',
        'email' => 'customer@example.com',
    ]);

    $lpa = Lpa::query()->create([
        'user_id' => $user->id,
        'who_for' => 'Me',
        'document_type' => 'health',
        'status' => 'completed',
        'donor_details' => [
            'title' => 'Ms',
            'firstName' => 'Jane',
            'lastName' => 'Roe',
            'birthDay' => '5',
            'birthMonth' => '6',
            'birthYear' => '1975',
        ],
        'contact_details' => [
            'addressLine1' => '1 High Street',
            'town' => 'Leeds',
            'postcode' => 'LS1 1AA',
            'email' => 'jane@example.com',
        ],
        'attorneys' => [[
            'title' => 'Mr',
            'firstName' => 'John',
            'lastName' => 'Doe',
            'middleNames' => '',
            'postcode' => 'LS2 2BB',
            'addressLine1' => '2 Low Road',
            'addressLine2' => '',
            'town' => 'Leeds',
            'county' => '',
            'birthDay' => '1',
            'birthMonth' => '1',
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
            'preferences' => 'Stay near family.',
        ],
        'is_draft' => false,
        'amount' => 82.00,
        'paid_at' => now(),
        'payment_reference' => 'pi_test_abc',
    ]);

    $sections = LpaAdminEmailSummary::sections($lpa->fresh('user'));

    expect($sections)->not->toBeEmpty();
    expect($sections[0]['title'])->toContain('Customer');

    $allText = collect($sections)
        ->flatMap(fn(array $s) => $s['rows'])
        ->pluck('value')
        ->implode(' ');

    expect($allText)->toContain('Jane')
        ->and($allText)->toContain('John')
        ->and($allText)->toContain('Jointly and severally')
        ->and($allText)->toContain('Stay near family');
});

it('renders admin mailable with summary sections', function (): void {
    $user = User::factory()->create();
    $lpa = Lpa::query()->create([
        'user_id' => $user->id,
        'who_for' => 'Me',
        'document_type' => 'property',
        'status' => 'completed',
        'donor_details' => ['firstName' => 'A', 'lastName' => 'B'],
        'contact_details' => ['postcode' => 'M1 1AA'],
        'is_draft' => false,
        'amount' => 82.00,
        'paid_at' => now(),
        'payment_reference' => 'pi_x',
    ]);

    $mailable = new LpaCompletedAdminEmail($lpa->fresh('user'));
    $html = $mailable->render();

    expect($html)->toContain('1. Customer')
        ->and($html)->toContain('full application data');
});

it('includes LP1F when-attorneys choice in admin summary for property', function (): void {
    $user = User::factory()->create();
    $lpa = Lpa::query()->create([
        'user_id' => $user->id,
        'who_for' => 'Me',
        'document_type' => 'property',
        'status' => 'completed',
        'donor_details' => ['firstName' => 'P', 'lastName' => 'Q'],
        'contact_details' => ['postcode' => 'EC1A 1BB'],
        'attorneys' => [],
        'is_draft' => false,
        'amount' => 82.00,
        'paid_at' => now(),
        'payment_reference' => 'pi_y',
        'lp1h_form' => [
            'when_attorneys_can_act' => 'only_without_capacity',
        ],
    ]);

    $sections = LpaAdminEmailSummary::sections($lpa->fresh('user'));
    $blob = collect($sections)->flatMap(fn(array $s) => $s['rows'])->pluck('value')->implode(' ');

    expect($blob)->toContain('Only when the donor does not have mental capacity');
});
