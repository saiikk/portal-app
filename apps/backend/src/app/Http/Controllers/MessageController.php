<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, Group $group)
    {
        $this->authorizeMember($request, $group);

        $messages = $group->messages()->with('user')->orderBy('created_at')->get();

        return response()->json($messages);
    }

    public function store(Request $request, Group $group)
    {
        $this->authorizeMember($request, $group);

        $validated = $request->validate([
            'body' => ['required', 'string'],
        ]);

        $message = $group->messages()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
        ]);

        return response()->json($message->load('user'), 201);
    }

    private function authorizeMember(Request $request, Group $group): void
    {
        abort_unless(
            $group->members()->where('user_id', $request->user()->id)->exists(),
            403,
            'このグループのメンバーではありません。'
        );
    }
}
