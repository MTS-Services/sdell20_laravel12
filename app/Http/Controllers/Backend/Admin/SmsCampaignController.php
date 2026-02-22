<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SmsCampaignRequest;
use App\Models\SmsCampaign;
use App\Models\SmsCampaignLog;
use App\Services\SmsCampaignService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class SmsCampaignController extends Controller
{
    public function __construct(private readonly SmsCampaignService $campaignService) {}

    public function index(Request $request): Response
    {
        $campaigns = SmsCampaign::query()
            ->where('admin_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(15)
            ->through(fn (SmsCampaign $campaign) => [
                'id' => $campaign->id,
                'name' => $campaign->name ?? 'Untitled Campaign',
                'message' => $campaign->message,
                'schedule_type' => $campaign->schedule_type,
                'status' => $campaign->status,
                'total_numbers' => $campaign->total_numbers,
                'sent_count' => $campaign->sent_count,
                'failed_count' => $campaign->failed_count,
                'pending_count' => $campaign->pending_count,
                'is_enabled' => $campaign->is_enabled,
                'last_run_at' => $campaign->last_run_at?->format('Y-m-d H:i'),
                'next_run_at' => $campaign->next_run_at?->format('Y-m-d H:i'),
                'created_at' => $campaign->created_at->format('Y-m-d H:i'),
            ]);

        return Inertia::render('backend/Admin/Campaigns/Index', [
            'campaigns' => $campaigns,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('backend/Admin/Campaigns/Create', [
            'senderId' => config('clicksend.sender_id'),
            'timezone' => config('app.timezone', 'Europe/London'),
        ]);
    }

    public function store(SmsCampaignRequest $request): RedirectResponse
    {
        $phoneNumbers = $this->campaignService->parsePhoneNumbersFromCsv(
            $request->file('csv_file')
        );

        if (empty($phoneNumbers)) {
            return back()->withErrors([
                'csv_file' => 'No valid UK phone numbers found. Ensure numbers are in E.164 format (e.g., +447XXXXXXXXX).',
            ]);
        }

        /** @var \App\Models\User $admin */
        $admin = $request->user();

        $campaignData = [
            'admin_id' => $admin->id,
            'name' => $request->validated('name'),
            'message' => $request->validated('message'),
            'sender_id' => config('clicksend.sender_id'),
            'schedule_type' => $request->validated('schedule_type'),
            'timezone' => config('app.timezone', 'Europe/London'),
            'status' => 'scheduled',
            'csv_filename' => $request->file('csv_file')->getClientOriginalName(),
        ];

        // Set schedule time based on type
        if ($request->validated('schedule_type') === 'one_time') {
            $scheduledAt = Carbon::parse($request->validated('scheduled_at'), config('app.timezone', 'Europe/London'))->utc();
            $campaignData['scheduled_at'] = $scheduledAt;
            $campaignData['next_run_at'] = $scheduledAt;
        } else {
            $campaignData['daily_time'] = $request->validated('daily_time');
        }

        $campaign = $this->campaignService->createCampaignWithLogs($campaignData, $phoneNumbers);

        // Calculate next_run_at for daily campaigns
        if ($campaign->isDaily()) {
            $nextRunAt = $this->campaignService->calculateNextRunAt($campaign);
            $campaign->update(['next_run_at' => $nextRunAt]);
        }

        Log::channel('clicksend')->info("Admin #{$admin->id} created campaign #{$campaign->id}", [
            'name' => $campaign->name,
            'total_numbers' => count($phoneNumbers),
            'schedule_type' => $campaign->schedule_type,
        ]);

        return redirect()
            ->route('admin.campaigns.show', $campaign)
            ->with('success', 'Campaign created with '.count($phoneNumbers).' numbers. It will run at the scheduled time.');
    }

    public function show(Request $request, SmsCampaign $campaign): Response
    {
        abort_unless($campaign->admin_id === $request->user()->id, 403);

        $failedLogs = $campaign->logs()
            ->where('status', 'failed')
            ->get()
            ->map(fn (SmsCampaignLog $log) => [
                'phone_number' => $log->phone_number,
                'error_reason' => $log->error_reason,
            ])
            ->values();

        $logs = $campaign->logs()
            ->orderByDesc('id')
            ->paginate(30)
            ->through(fn (SmsCampaignLog $log) => [
                'id' => $log->id,
                'phone_number' => $log->phone_number,
                'status' => $log->status,
                'error_reason' => $log->error_reason,
                'provider_message_id' => $log->provider_message_id,
                'sent_at' => $log->sent_at?->format('Y-m-d H:i'),
            ]);

        return Inertia::render('backend/Admin/Campaigns/Show', [
            'campaign' => [
                'id' => $campaign->id,
                'name' => $campaign->name ?? 'Untitled Campaign',
                'message' => $campaign->message,
                'sender_id' => $campaign->sender_id,
                'schedule_type' => $campaign->schedule_type,
                'scheduled_at' => $campaign->scheduled_at?->format('Y-m-d H:i'),
                'daily_time' => $campaign->daily_time,
                'timezone' => $campaign->timezone,
                'status' => $campaign->status,
                'total_numbers' => $campaign->total_numbers,
                'sent_count' => $campaign->sent_count,
                'failed_count' => $campaign->failed_count,
                'pending_count' => $campaign->pending_count,
                'csv_filename' => $campaign->csv_filename,
                'is_enabled' => $campaign->is_enabled,
                'last_run_at' => $campaign->last_run_at?->format('Y-m-d H:i'),
                'next_run_at' => $campaign->next_run_at?->format('Y-m-d H:i'),
                'created_at' => $campaign->created_at->format('Y-m-d H:i'),
            ],
            'failedLogs' => $failedLogs,
            'logs' => $logs,
        ]);
    }

    /**
     * Toggle a campaign's enabled/disabled state.
     */
    public function toggle(Request $request, SmsCampaign $campaign): RedirectResponse
    {
        abort_unless($campaign->admin_id === $request->user()->id, 403);

        $newEnabled = ! $campaign->is_enabled;
        $updateData = ['is_enabled' => $newEnabled];

        if ($newEnabled) {
            // Re-enable: set status back to scheduled and calculate next run
            $updateData['status'] = 'scheduled';
            $updateData['next_run_at'] = $this->campaignService->calculateNextRunAt($campaign);
        } else {
            // Disable: set status to paused
            $updateData['status'] = 'paused';
            $updateData['next_run_at'] = null;
        }

        $campaign->update($updateData);

        $state = $newEnabled ? 'enabled' : 'paused';

        return redirect()
            ->route('admin.campaigns.show', $campaign)
            ->with('success', "Campaign {$state} successfully.");
    }

    /**
     * Update schedule time for a campaign.
     */
    public function updateSchedule(Request $request, SmsCampaign $campaign): RedirectResponse
    {
        abort_unless($campaign->admin_id === $request->user()->id, 403);

        if ($campaign->isOneTime()) {
            $request->validate([
                'scheduled_at' => ['required', 'date', 'after:now'],
            ]);

            $scheduledAt = Carbon::parse($request->input('scheduled_at'), $campaign->timezone)->utc();
            $campaign->update([
                'scheduled_at' => $scheduledAt,
                'next_run_at' => $scheduledAt,
                'status' => 'scheduled',
            ]);
        } else {
            $request->validate([
                'daily_time' => ['required', 'date_format:H:i'],
            ]);

            $campaign->update([
                'daily_time' => $request->input('daily_time'),
            ]);

            $nextRunAt = $this->campaignService->calculateNextRunAt($campaign);
            $campaign->update(['next_run_at' => $nextRunAt]);
        }

        return redirect()
            ->route('admin.campaigns.show', $campaign)
            ->with('success', 'Campaign schedule updated successfully.');
    }

    /**
     * Delete a campaign and its logs.
     */
    public function destroy(Request $request, SmsCampaign $campaign): RedirectResponse
    {
        abort_unless($campaign->admin_id === $request->user()->id, 403);

        $campaignName = $campaign->name ?? 'Untitled Campaign';
        $campaign->logs()->delete();
        $campaign->delete();

        return redirect()
            ->route('admin.campaigns.index')
            ->with('success', "Campaign \"{$campaignName}\" deleted successfully.");
    }

    /**
     * Download failed numbers as CSV.
     */
    public function downloadFailed(Request $request, SmsCampaign $campaign): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        abort_unless($campaign->admin_id === $request->user()->id, 403);

        $failedLogs = $campaign->logs()->where('status', 'failed')->get();

        $filename = "campaign_{$campaign->id}_failed_numbers.csv";

        return response()->streamDownload(function () use ($failedLogs) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Phone Number', 'Error Reason']);

            foreach ($failedLogs as $log) {
                fputcsv($handle, [$log->phone_number, $log->error_reason]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
