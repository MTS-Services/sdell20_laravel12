<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\BulkSmsSendRequest;
use App\Jobs\ProcessBulkSmsSendJob;
use App\Models\BulkSmsSend;
use App\Models\SmsSendLog;
use App\Rules\E164PhoneNumber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AdminBulkSmsController extends Controller
{
    public function index(Request $request): Response
    {
        $sends = BulkSmsSend::query()
            ->where('admin_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(15)
            ->through(fn (BulkSmsSend $send) => [
                'id' => $send->id,
                'message' => $send->message,
                'total_numbers' => $send->total_numbers,
                'sent_count' => $send->sent_count,
                'failed_count' => $send->failed_count,
                'pending_count' => $send->pending_count,
                'status' => $send->status,
                'csv_filename' => $send->csv_filename,
                'created_at' => $send->created_at->format('Y-m-d H:i'),
            ]);

        return Inertia::render('backend/Admin/BulkSms/Index', [
            'sends' => $sends,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('backend/Admin/BulkSms/Create');
    }

    public function store(BulkSmsSendRequest $request): RedirectResponse
    {
        $phoneNumbers = $this->extractPhoneNumbers($request);

        if (empty($phoneNumbers)) {
            return back()->withErrors([
                'csv_file' => 'No valid phone numbers found. Ensure numbers are in E.164 format (e.g., +8801XXXXXXXXX).',
            ]);
        }

        $csvFilename = null;
        if ($request->hasFile('csv_file')) {
            $csvFilename = $request->file('csv_file')->getClientOriginalName();
        }

        /** @var \App\Models\User $admin */
        $admin = $request->user();

        $bulkSend = BulkSmsSend::create([
            'admin_id' => $admin->id,
            'message' => $request->validated('message'),
            'total_numbers' => count($phoneNumbers),
            'pending_count' => count($phoneNumbers),
            'status' => 'pending',
            'csv_filename' => $csvFilename,
        ]);

        foreach ($phoneNumbers as $phone) {
            SmsSendLog::create([
                'bulk_sms_send_id' => $bulkSend->id,
                'phone_number' => $phone,
                'message' => $request->validated('message'),
                'status' => 'pending',
                'created_by' => $admin->id,
            ]);
        }

        ProcessBulkSmsSendJob::dispatch($bulkSend->id)->onQueue('sms');

        Log::channel('clicksend')->info("Admin #{$admin->id} initiated bulk SMS", [
            'bulk_send_id' => $bulkSend->id,
            'total_numbers' => count($phoneNumbers),
        ]);

        return redirect()
            ->route('admin.bulk-sms.show', $bulkSend)
            ->with('success', count($phoneNumbers).' SMS messages queued for sending.');
    }

    public function show(Request $request, BulkSmsSend $bulkSmsSend): Response
    {
        abort_unless($bulkSmsSend->admin_id === $request->user()->id, 403);

        $bulkSmsSend->load('logs');

        $failedLogs = $bulkSmsSend->logs
            ->where('status', 'failed')
            ->map(fn (SmsSendLog $log) => [
                'phone_number' => $log->phone_number,
                'error_reason' => $log->error_reason,
            ])
            ->values();

        return Inertia::render('backend/Admin/BulkSms/Show', [
            'bulkSend' => [
                'id' => $bulkSmsSend->id,
                'message' => $bulkSmsSend->message,
                'total_numbers' => $bulkSmsSend->total_numbers,
                'sent_count' => $bulkSmsSend->sent_count,
                'failed_count' => $bulkSmsSend->failed_count,
                'pending_count' => $bulkSmsSend->pending_count,
                'status' => $bulkSmsSend->status,
                'csv_filename' => $bulkSmsSend->csv_filename,
                'created_at' => $bulkSmsSend->created_at->format('Y-m-d H:i'),
            ],
            'failedLogs' => $failedLogs,
            'logs' => $bulkSmsSend->logs
                ->map(fn (SmsSendLog $log) => [
                    'id' => $log->id,
                    'phone_number' => $log->phone_number,
                    'status' => $log->status,
                    'error_reason' => $log->error_reason,
                    'provider_message_id' => $log->provider_message_id,
                    'sent_at' => $log->sent_at?->format('Y-m-d H:i'),
                ])
                ->values(),
        ]);
    }

    /**
     * Extract and deduplicate phone numbers from CSV file and/or manual input.
     *
     * @return array<string>
     */
    private function extractPhoneNumbers(BulkSmsSendRequest $request): array
    {
        $phoneNumbers = [];
        $e164Rule = new E164PhoneNumber;

        // Parse CSV file
        if ($request->hasFile('csv_file')) {
            $file = $request->file('csv_file');
            $csvContent = file_get_contents($file->getRealPath());
            $lines = preg_split('/\r\n|\r|\n/', $csvContent);

            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line)) {
                    continue;
                }

                // Handle CSV with columns — try first column, or any column with a phone-like value
                $columns = str_getcsv($line);
                foreach ($columns as $cell) {
                    $cell = trim($cell);
                    // Skip header-like values
                    if (preg_match('/^(phone|number|mobile|cell|tel)/i', $cell)) {
                        continue;
                    }

                    $isValid = true;
                    $e164Rule->validate('phone', $cell, function () use (&$isValid) {
                        $isValid = false;
                    });

                    if ($isValid) {
                        $phoneNumbers[] = $cell;

                        break; // Take the first valid phone per row
                    }
                }
            }
        }

        // Add manual phone number
        if ($request->filled('manual_phone')) {
            $phoneNumbers[] = $request->validated('manual_phone');
        }

        // Remove duplicates
        return array_values(array_unique($phoneNumbers));
    }
}
