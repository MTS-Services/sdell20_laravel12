<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class E164PhoneNumber implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // E.164: + followed by 7–15 digits
        if (! preg_match('/^\+[1-9]\d{6,14}$/', $value)) {
            $fail('The :attribute must be in E.164 format (e.g., +8801XXXXXXXXX).');
        }
    }
}
