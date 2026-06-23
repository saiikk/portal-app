<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::where('id', '!=', $request->user()->id)
            ->select('id', 'name', 'type')
            ->withCount('groups')
            ->orderBy('name')
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'type' => $u->type,
                'has_group' => $u->type === 'new_graduate' && $u->groups_count > 0,
            ]);

        return response()->json($users);
    }

    public function newGraduates(Request $request)
    {
        $users = User::where('type', 'new_graduate')
            ->select('id', 'name', 'icon_url', 'comment')
            ->get();

        return response()->json($users);
    }

    public function employees(Request $request)
    {
        $users = User::where('type', 'employee')
            ->select('id', 'name', 'icon_url', 'comment', 'department', 'position')
            ->get();

        return response()->json($users);
    }
}
