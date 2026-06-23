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

    public function members(Group $group)
    {
        $members = $group->members()
            ->select('users.id', 'users.name', 'users.icon_url', 'users.type')
            ->get()
            ->map(fn($m) => [
                'id'       => $m->id,
                'name'     => $m->name,
                'icon_url' => $m->icon_url,
                'type'     => $m->type,
                'role'     => $m->pivot->role,
            ]);

        return response()->json($members);
    }

    public function updateMemberRole(Request $request, Group $group, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', 'in:owner,member'],
        ]);

        if ($validated['role'] === 'member') {
            $ownerCount = $group->members()->wherePivot('role', 'owner')->count();
            $isLastOwner = $group->members()
                ->wherePivot('role', 'owner')
                ->where('users.id', $user->id)
                ->exists();

            if ($ownerCount <= 1 && $isLastOwner) {
                throw ValidationException::withMessages([
                    'role' => ['グループには最低1人のオーナーが必要です。'],
                ]);
            }
        }

        $group->members()->updateExistingPivot($user->id, ['role' => $validated['role']]);

        return response()->json(['message' => 'ok']);
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
