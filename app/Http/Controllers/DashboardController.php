<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): RedirectResponse|Response
    {
        if ($request->user()->is_admin) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('backend/User/UserForm', [
            'user' => $request->user(),
        ]);
    }

    public function userForm(Request $request): Response
    {
        return Inertia::render('backend/User/UserForm', [
            'user' => $request->user(),
        ]);
    }

    public function userDashboard(Request $request): Response
    {
        return Inertia::render('backend/User/UserDashboard', [
            'user' => $request->user(),
        ]);
    }

    public function adminDashboard(Request $request): Response
    {
        return Inertia::render('backend/Admin/AdminDashboard', [
            'user' => $request->user(),
            'totalUsers' => \App\Models\User::count(),
        ]);
    }
}
