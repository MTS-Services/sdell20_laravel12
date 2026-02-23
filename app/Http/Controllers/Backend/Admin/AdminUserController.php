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
        $role = $request->string('role')->lower();

        $usersQuery = User::query()
            ->select('id', 'name', 'email', 'is_admin', 'created_at')
            ->latest();

        if ($role === 'admin') {
            $usersQuery->where('is_admin', true);
        } elseif ($role === 'user') {
            $usersQuery->where('is_admin', false);
        }

        return Inertia::render('backend/Admin/Users/Index', [
            'users' => $usersQuery->paginate(15)->withQueryString(),
            'totalUsers' => User::count(),
            'currentFilter' => $role ?: 'all',
        ]);
    }
}
