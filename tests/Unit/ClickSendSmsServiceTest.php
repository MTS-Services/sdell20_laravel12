<?php

use App\Rules\E164PhoneNumber;

it('validates phone number is e164 format', function () {
    $rule = new E164PhoneNumber;

    $closure = function ($message) {
        expect($message)->toContain('E.164');
    };

    // Valid — the closure should NOT be called (no failure)
    $called = false;
    $rule->validate('phone', '+8801712345678', function () use (&$called) {
        $called = true;
    });
    expect($called)->toBeFalse();

    // Invalid - no prefix
    $rule->validate('phone', '01712345678', $closure);

    // Invalid - wrong prefix
    $rule->validate('phone', '18801234567', $closure);

    // Invalid - too short
    $rule->validate('phone', '+880171', $closure);

    // Invalid - too long
    $rule->validate('phone', '+880171234567890123', $closure);
});

it('validates valid international phone numbers', function () {
    $rule = new E164PhoneNumber;

    $validNumbers = [
        '+14155552671',
        '+447911123456',
        '+8801712345678',
        '+919876543210',
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
        '+0123456789',    // Cannot start with 0
        '01712345678',    // Missing +
        '+88',            // Too short
    ];

    foreach ($invalidNumbers as $number) {
        $called = false;
        $rule->validate('phone', $number, function () use (&$called) {
            $called = true;
        });
        expect($called)->toBeTrue("Expected {$number} to be invalid");
    }
});
