<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        $groups = $request->user()->groups()->with('creator')->get();

        return response()->json($groups);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'member_ids' => ['sometimes', 'array'],
            'member_ids.*' => ['uuid', 'exists:users,id'],
        ]);

        $memberIds = $validated['member_ids'] ?? [];

        if (!empty($memberIds)) {
            $conflicts = User::whereIn('id', $memberIds)
                ->where('type', 'new_graduate')
                ->whereHas('groups')
                ->pluck('name');

            if ($conflicts->isNotEmpty()) {
                throw ValidationException::withMessages([
                    'member_ids' => [$conflicts->join('、') . ' は既に別のグループに参加しています。'],
                ]);
            }
        }

        $group = Group::create([
            'name' => $validated['name'],
            'created_by' => $request->user()->id,
        ]);

        $group->members()->attach($request->user()->id, ['role' => 'owner']);

        foreach ($memberIds as $userId) {
            if ($userId !== $request->user()->id) {
                $group->members()->attach($userId, ['role' => 'member']);
            }
        }

        return response()->json($group, 201);
    }
}
