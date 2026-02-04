<?php

namespace App\Http\Controllers;

use App\Concerns\ProfileValidationRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    use ProfileValidationRules;

    public function edit()
    {
        return Inertia::render('Profile/Edit', [
            'user' => Auth::user(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate($this->profileRules($request->user()->id));

        $user = Auth::user();
        $user->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }
}
