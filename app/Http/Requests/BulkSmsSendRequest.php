<?php

namespace App\Http\Requests;

use App\Rules\E164PhoneNumber;
use Illuminate\Foundation\Http\FormRequest;

class BulkSmsSendRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->is_admin === true;
    }

    public function rules(): array
    {
        return [
            'csv_file' => ['nullable', 'file', 'mimes:csv,txt', 'max:5120'],
            'manual_phone' => ['nullable', 'string', new E164PhoneNumber],
            'message' => ['required', 'string', 'min:1', 'max:1600'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'csv_file.mimes' => 'The CSV file must be a .csv or .txt file.',
            'csv_file.max' => 'The CSV file must not exceed 5MB.',
            'message.required' => 'The SMS message body is required.',
            'message.max' => 'The SMS message must not exceed 1600 characters.',
        ];
    }

    public function withValidator(\Illuminate\Validation\Validator $validator): void
    {
        $validator->after(function (\Illuminate\Validation\Validator $validator) {
            if (! $this->hasFile('csv_file') && ! $this->filled('manual_phone')) {
                $validator->errors()->add(
                    'csv_file',
                    'You must provide either a CSV file or a manual phone number.'
                );
            }
        });
    }
}
