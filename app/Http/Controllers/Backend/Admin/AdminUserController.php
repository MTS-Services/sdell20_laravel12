<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('backend/Admin/Users/Index', [
            'users' => User::query()
                ->select('id', 'name', 'email', 'is_admin', 'created_at')
                ->latest()
                ->paginate(15),
            'totalUsers' => User::count(),
        ]);
    }
}
