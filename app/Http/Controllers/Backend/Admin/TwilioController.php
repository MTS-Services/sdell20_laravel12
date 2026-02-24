<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\BulkSmsCampaign;
use App\Models\SmsLog;
use App\Services\TwilioService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TwilioController extends Controller
{
    public function __construct(protected TwilioService $twilio) {}

    /**
     * Main Twilio SMS page with recent logs.
     */
    public function index(): Response
    {
        return Inertia::render('backend/Admin/Twilio/Index', [
            'recentLogs' => SmsLog::query()->latest()->take(10)->get(),
        ]);
    }

    /**
     * Bulk SMS campaigns listing page.
     */
    public function bulkIndex(): Response
    {
        return Inertia::render('backend/Admin/Twilio/Bulk', [
            'campaigns' => BulkSmsCampaign::query()->latest()->paginate(10),
        ]);
    }

    /**
     * Campaign detail page with logs.
     */
    public function campaignShow(int $id): Response
    {
        $campaign = BulkSmsCampaign::with('logs')->findOrFail($id);

        return Inertia::render('backend/Admin/Twilio/CampaignDetail', [
            'campaign' => $campaign,
            'logs' => $campaign->logs()->paginate(20),
        ]);
    }

    /**
     * Send a single SMS to the given phone number.
     */
    public function sendSms(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'phone' => 'required|string|min:10|max:16',
            'message' => 'required|string|max:1600',
        ]);

        $result = $this->twilio->sendSMS($request->phone, $request->message);

        if ($result['success']) {
            return back()->with('success', 'SMS sent! SID: '.$result['sid']);
        }

        return back()->withErrors(['phone' => $result['error']]);
    }

    /**
     * Upload a CSV file and dispatch bulk SMS jobs.
     */
    public function bulkUploadCsv(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'campaign_name' => 'required|string|max:255',
            'message' => 'required|string|max:1600',
            'csv_file' => 'required|file|mimes:csv,txt',
        ]);

        $path = $request->file('csv_file')->store('bulk_sms_csv', 'local');

        $result = $this->twilio->processBulkCsvAndDispatch(
            campaignName: $request->campaign_name,
            message: $request->message,
            csvFilePath: $path,
            userId: auth()->id()
        );

        if ($result['success']) {
            return redirect()->route('admin.twilio.campaign.show', $result['campaign']->id)
                ->with('success', "Campaign created! {$result['total']} messages queued.");
        }

        Storage::disk('local')->delete($path);

        return back()->withErrors(['csv_file' => $result['error']]);
    }

    /**
     * Dispatch bulk SMS from manually entered phone numbers.
     */
    public function bulkManual(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'campaign_name' => 'required|string|max:255',
            'message' => 'required|string|max:1600',
            'phone_numbers' => 'required|string',
        ]);

        $numbers = preg_split('/[\n,]+/', $request->phone_numbers);
        $numbers = array_filter(array_map('trim', $numbers));

        if (count($numbers) === 0) {
            return back()->withErrors(['phone_numbers' => 'No valid phone numbers found.']);
        }

        $result = $this->twilio->dispatchBulkFromNumbers(
            campaignName: $request->campaign_name,
            message: $request->message,
            phoneNumbers: array_values($numbers),
            userId: auth()->id()
        );

        if ($result['success']) {
            return redirect()->route('admin.twilio.campaign.show', $result['campaign']->id)
                ->with('success', "Campaign created! {$result['total']} messages queued.");
        }

        return back()->withErrors(['phone_numbers' => $result['error']]);
    }

    /**
     * Return live campaign status as JSON (for polling).
     */
    public function campaignStatus(int $id): \Illuminate\Http\JsonResponse
    {
        $campaign = BulkSmsCampaign::findOrFail($id);

        return response()->json([
            'id' => $campaign->id,
            'status' => $campaign->status,
            'total_recipients' => $campaign->total_recipients,
            'sent_count' => $campaign->sent_count,
            'failed_count' => $campaign->failed_count,
            'progress_percentage' => $campaign->progress_percentage,
        ]);
    }

    /**
     * Stream a sample CSV template for download.
     */
    public function downloadCsvTemplate(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="bulk_sms_template.csv"',
        ];

        $rows = [
            ['phone', 'name', 'email'],
            ['+447911123456', 'John Smith', 'john@example.com'],
            ['+8801711123456', 'Rahman Ahmed', 'rahman@example.com'],
            ['07911123457', 'Jane Doe', 'jane@example.com'],
            ['01711123457', 'Karim Hossain', 'karim@example.com'],
        ];

        $callback = function () use ($rows): void {
            $file = fopen('php://output', 'w');

            foreach ($rows as $row) {
                fputcsv($file, $row);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Handle incoming Twilio webhook (inbound SMS).
     */
    public function webhook(Request $request): \Illuminate\Http\Response
    {
        $from = $request->input('From');
        $body = $request->input('Body');
        $to = $request->input('To');

        Log::info("Incoming SMS from {$from} to {$to}: {$body}");

        SmsLog::create([
            'to' => $to,
            'from' => $from,
            'message' => $body,
            'status' => 'received',
            'type' => 'incoming',
        ]);

        return response('<Response><Message>Message received, thank you!</Message></Response>')
            ->header('Content-Type', 'text/xml');
    }
}
