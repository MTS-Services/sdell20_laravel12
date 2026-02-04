<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->is_admin) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Dashboard/UserDashboard', [
            'user' => $request->user(),
        ]);
    }

    public function adminDashboard(Request $request)
    {
        return Inertia::render('Dashboard/AdminDashboard', [
            'user' => $request->user(),
            'totalUsers' => \App\Models\User::count(),
        ]);
    }
}
