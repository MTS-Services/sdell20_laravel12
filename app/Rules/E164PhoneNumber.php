<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class E164PhoneNumber implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // UK E.164: +44 followed by 10 digits (total 13 chars)
        if (! $this->isValid($value)) {
            $fail('The :attribute must be a valid UK phone number in E.164 format (e.g., +447XXXXXXXXX).');
        }
    }

    /**
     * Check if a phone number is a valid UK E.164 format.
     */
    public function isValid(mixed $value): bool
    {
        return (bool) preg_match('/^\+44[1-9]\d{8,9}$/', (string) $value);
    }
}
