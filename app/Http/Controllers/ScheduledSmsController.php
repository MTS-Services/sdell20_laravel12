<?php

namespace App\Http\Controllers;

use App\Models\ScheduledSms;
use App\Rules\E164PhoneNumber;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScheduledSmsController extends Controller
{
    public function index(Request $request): Response
    {
        $messages = ScheduledSms::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('scheduled_at')
            ->paginate(20)
            ->through(fn ($sms) => [
                'id' => $sms->id,
                'to_phone' => $sms->to_phone,
                'message' => $sms->message,
                'scheduled_at' => $sms->scheduled_at
                    ->setTimezone($sms->timezone)
                    ->format('Y-m-d H:i'),
                'status' => $sms->status,
                'attempts' => $sms->attempts,
                'last_error' => $sms->last_error,
                'sent_at' => $sms->sent_at?->setTimezone($sms->timezone)->format('Y-m-d H:i'),
            ]);

        return Inertia::render('Sms/Index', ['messages' => $messages]);
    }

    public function create(): Response
    {
        return Inertia::render('Sms/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'to_phone' => ['required', 'string', new E164PhoneNumber],
            'message' => ['required', 'string', 'min:1', 'max:1600'],
            'scheduled_at' => ['required', 'date', 'after:now'],
        ]);

        $scheduledUtc = Carbon::createFromFormat(
            'Y-m-d\TH:i',
            $request->scheduled_at,
            'Asia/Dhaka'
        )->utc();

        ScheduledSms::create([
            'user_id' => $request->user()->id,
            'to_phone' => $request->to_phone,
            'message' => $request->message,
            'scheduled_at' => $scheduledUtc,
            'timezone' => 'Asia/Dhaka',
        ]);

        return redirect()->route('sms.index')
            ->with('success', 'SMS scheduled successfully.');
    }

    public function destroy(Request $request, ScheduledSms $scheduledSms): RedirectResponse
    {
        abort_unless($scheduledSms->user_id === $request->user()->id, 403);
        abort_unless($scheduledSms->isPending(), 422, 'Cannot cancel a non-pending SMS.');

        $scheduledSms->update(['status' => 'cancelled']);

        return back()->with('success', 'SMS cancelled.');
    }
}
