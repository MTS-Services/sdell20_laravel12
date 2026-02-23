<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class E164PhoneNumber implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $this->isValid($value)) {
            $fail('The :attribute must be a valid UK or Bangladesh phone number in E.164 format (e.g., +447XXXXXXXXX or +8801XXXXXXXXX).');
        }
    }

    /**
     * Check if a phone number is a valid UK or Bangladesh E.164 format.
     *
     * UK: +44 followed by 10 digits (e.g., +447123456789)
     * Bangladesh: +880 followed by 10 digits (e.g., +8801712345678)
     */
    public function isValid(mixed $value): bool
    {
        $phone = (string) $value;

        // UK: +44 followed by 10 digits
        $isUK = (bool) preg_match('/^\+44[1-9]\d{8,9}$/', $phone);

        // Bangladesh: +880 followed by 10 digits (mobile numbers start with 1)
        $isBangladesh = (bool) preg_match('/^\+8801[3-9]\d{8}$/', $phone);

        return $isUK || $isBangladesh;
    }
}
