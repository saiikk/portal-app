<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;

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
        ]);

        $group = Group::create([
            'name' => $validated['name'],
            'created_by' => $request->user()->id,
        ]);

        $group->members()->attach($request->user()->id, ['role' => 'owner']);

        return response()->json($group, 201);
    }
}
