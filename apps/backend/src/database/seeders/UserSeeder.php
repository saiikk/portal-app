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
        $users = [
            [
                'name' => '五十嵐 健太',
                'email' => 'igarashi@example.com',
                'type' => 'employee',
                'role' => 'admin',
                'department' => '人事部',
                'position' => '人事担当',
            ],
            [
                'name' => '森 直樹',
                'email' => 'mori@example.com',
                'type' => 'employee',
                'role' => 'admin',
                'department' => '人事部',
                'position' => '人事担当',
            ],
            [
                'name' => '田島 美咲',
                'email' => 'tajima@example.com',
                'type' => 'employee',
                'role' => 'admin',
                'department' => '人事部',
                'position' => '人事担当',
            ],
            [
                'name' => '桐谷 翔太',
                'email' => 'kiriya@example.com',
                'type' => 'employee',
                'role' => 'admin',
                'department' => '人事部',
                'position' => '人事担当',
            ],
            [
                'name' => '伊藤 花子',
                'email' => 'itou@example.com',
                'type' => 'employee',
                'role' => 'admin',
                'department' => '人事部',
                'position' => '人事担当',
            ],
            [
                'name' => '佐々木 大輝',
                'email' => 'sasaki@example.com',
                'type' => 'new_graduate',
                'role' => 'general',
            ],
            [
                'name' => '古賀 さくら',
                'email' => 'koga@example.com',
                'type' => 'new_graduate',
                'role' => 'general',
            ],
            [
                'name' => '鶴岡 悠斗',
                'email' => 'turuoka@example.com',
                'type' => 'new_graduate',
                'role' => 'general',
            ],
            [
                'name' => '益川 あかり',
                'email' => 'masukawa@example.com',
                'type' => 'new_graduate',
                'role' => 'general',
            ],
            [
                'name' => '李 ジュンホ',
                'email' => 'lee@example.com',
                'type' => 'new_graduate',
                'role' => 'general',
            ],
        ];

        foreach ($users as $data) {
            User::factory()->create(array_merge(['password' => 'password'], $data));
        }
    }
}
