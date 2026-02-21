<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class E164PhoneNumber implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // E.164: + followed by 7–15 digits
        if (! $this->isValid($value)) {
            $fail('The :attribute must be in E.164 format (e.g., +8801XXXXXXXXX).');
        }
    }

    /**
     * Check if a phone number matches E.164 format.
     */
    public function isValid(mixed $value): bool
    {
        return (bool) preg_match('/^\+[1-9]\d{6,14}$/', (string) $value);
    }
}
