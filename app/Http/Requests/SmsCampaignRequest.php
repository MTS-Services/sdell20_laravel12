<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SmsCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->is_admin === true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'csv_file' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
            'message' => ['required', 'string', 'min:1', 'max:1600'],
            'schedule_type' => ['required', 'in:one_time,daily'],
            'scheduled_at' => ['required_if:schedule_type,one_time', 'nullable', 'date', 'after:now'],
            'daily_time' => ['required_if:schedule_type,daily', 'nullable', 'date_format:H:i'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'csv_file.required' => 'A CSV file with phone numbers is required.',
            'csv_file.mimes' => 'The file must be a .csv or .txt file.',
            'csv_file.max' => 'The CSV file must not exceed 5MB.',
            'message.required' => 'The SMS message body is required.',
            'message.max' => 'The SMS message must not exceed 1600 characters.',
            'schedule_type.required' => 'Please select a schedule type.',
            'schedule_type.in' => 'Schedule type must be one-time or daily.',
            'scheduled_at.required_if' => 'A scheduled date/time is required for one-time campaigns.',
            'scheduled_at.after' => 'The scheduled time must be in the future.',
            'daily_time.required_if' => 'A daily send time is required for recurring campaigns.',
            'daily_time.date_format' => 'The daily time must be in HH:MM format.',
        ];
    }
}
