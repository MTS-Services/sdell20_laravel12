<?php

use App\Rules\E164PhoneNumber;

it('validates phone number is UK or Bangladesh e164 format', function () {
    $rule = new E164PhoneNumber;

    $closure = function ($message) {
        expect($message)->toContain('E.164');
    };

    // Valid UK number — the closure should NOT be called (no failure)
    $called = false;
    $rule->validate('phone', '+447911123456', function () use (&$called) {
        $called = true;
    });
    expect($called)->toBeFalse();

    // Valid Bangladesh number — the closure should NOT be called (no failure)
    $called = false;
    $rule->validate('phone', '+8801712345678', function () use (&$called) {
        $called = true;
    });
    expect($called)->toBeFalse();

    // Invalid - no prefix
    $rule->validate('phone', '07911123456', $closure);

    // Invalid - not UK or Bangladesh country code
    $rule->validate('phone', '+14155552671', $closure);

    // Invalid - too short
    $rule->validate('phone', '+4479', $closure);

    // Invalid - too long
    $rule->validate('phone', '+44791112345678901', $closure);
});

it('validates valid UK and Bangladesh phone numbers', function () {
    $rule = new E164PhoneNumber;

    $validNumbers = [
        // UK numbers
        '+447911123456',
        '+447700900123',
        '+442071234567',
        '+441234567890',
        // Bangladesh numbers
        '+8801712345678',
        '+8801812345678',
        '+8801912345678',
        '+8801312345678',
    ];

    foreach ($validNumbers as $number) {
        $called = false;
        $rule->validate('phone', $number, function () use (&$called) {
            $called = true;
        });
        expect($called)->toBeFalse("Expected {$number} to be valid");
    }
});

it('rejects invalid phone numbers', function () {
    $rule = new E164PhoneNumber;

    $invalidNumbers = [
        '',
        '1234',
        '+0447911123456',  // Starts with 0 after +
        '07911123456',     // Missing +44
        '+44',             // Too short
        '+14155552671',    // US number
        '+919876543210',   // India number
        '+8801012345678',  // Bangladesh landline (starts with 0)
        '+8801212345678',  // Bangladesh invalid (starts with 2)
        '+880171234567',   // Bangladesh too short
        '+88017123456789', // Bangladesh too long
    ];

    foreach ($invalidNumbers as $number) {
        $called = false;
        $rule->validate('phone', $number, function () use (&$called) {
            $called = true;
        });
        expect($called)->toBeTrue("Expected {$number} to be invalid");
    }
});
