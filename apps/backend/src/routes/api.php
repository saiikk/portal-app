<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/groups', [GroupController::class, 'index']);
    Route::post('/groups', [GroupController::class, 'store'])->middleware('can:create,App\Models\Group');
    Route::get('/groups/{group}/members', [GroupController::class, 'members']);
    Route::patch('/groups/{group}/members/{user}', [GroupController::class, 'updateMemberRole']);
    Route::get('/groups/{group}/messages', [MessageController::class, 'index']);
    Route::post('/groups/{group}/messages', [MessageController::class, 'store']);

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/new-graduates', [UserController::class, 'newGraduates']);
    Route::get('/users/employees', [UserController::class, 'employees']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
});
