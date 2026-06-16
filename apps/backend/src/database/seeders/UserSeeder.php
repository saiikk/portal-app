<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => '人事 太郎',
            'email' => 'employee@example.com',
            'password' => 'password',
            'type' => 'employee',
            'role' => 'admin',
            'department' => '人事部',
            'position' => '人事担当',
        ]);

        User::factory()->create([
            'name' => '新卒 花子',
            'email' => 'new-graduate@example.com',
            'password' => 'password',
            'type' => 'new_graduate',
            'role' => 'general',
        ]);
    }
}
