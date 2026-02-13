<?php

namespace App\Http\Controllers\Backend\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserDashboardController extends Controller
{
    public function index(Request $request): RedirectResponse|Response
    {
        $user = $request->user();

        if ($user->is_admin) {
            return redirect()->route('admin.dashboard');
        }

        if (! $user->has_completed_onboarding) {
            return $this->form($request);
        }

        return $this->dashboard($request);
    }

    public function form(Request $request): Response
    {
        return Inertia::render('backend/User/UserForm', [
            'user' => $request->user(),
        ]);
    }

    public function dashboard(Request $request): Response
    {
        return Inertia::render('backend/User/UserDashboard', [
            'user' => $request->user(),
        ]);
    }

    public function lpaCreate(Request $request): Response
    {
        return Inertia::render('backend/User/LpaCreate', [
            'user' => $request->user(),
        ]);
    }

    public function complete(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user->has_completed_onboarding) {
            $user->forceFill(['has_completed_onboarding' => true])->save();
        }

        return redirect()->route('dashboard.user');
    }
}
