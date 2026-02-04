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

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $avatarPath;
        }

        $user->update($validated);
        $user->refresh();

        return Inertia::render('Profile/Edit', [
            'user' => $user->fresh(),
        ])->with('success', 'Profile updated successfully.');
    }
}
