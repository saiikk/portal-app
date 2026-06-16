<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
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
