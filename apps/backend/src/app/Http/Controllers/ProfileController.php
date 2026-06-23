<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['sometimes', 'string', 'min:8', 'confirmed'],
        ]);

        $user->fill($validated)->save();

        return response()->json($user);
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'mimes:jpeg,jpg,png,webp,heic,heif', 'max:5120'],
        ]);

        $user = $request->user();

        if ($user->icon_url) {
            $oldPath = str_replace(Storage::disk('public')->url(''), '', $user->icon_url);
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->icon_url = Storage::disk('public')->url($path);
        $user->save();

        return response()->json($user);
    }
}
