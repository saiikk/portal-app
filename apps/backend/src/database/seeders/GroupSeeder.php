<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    public function run(): void
    {
        $admins = User::where('role', 'admin')->get();
        $general = User::where('role', 'general')->first();

        $groups = [
            ['name' => '新卒研修グループA', 'owner_index' => 0],
            ['name' => '新卒研修グループB', 'owner_index' => 1],
        ];

        foreach ($groups as $data) {
            $owner = $admins[$data['owner_index']];

            $group = Group::create([
                'name' => $data['name'],
                'created_by' => $owner->id,
            ]);

            // adminメンバーを追加（最初のadminはowner、残りはmember）
            foreach ($admins as $i => $admin) {
                $group->members()->attach($admin->id, [
                    'role' => $i === $data['owner_index'] ? 'owner' : 'member',
                ]);
            }

            // generalユーザーを1名追加
            $group->members()->attach($general->id, ['role' => 'member']);
        }
    }
}
