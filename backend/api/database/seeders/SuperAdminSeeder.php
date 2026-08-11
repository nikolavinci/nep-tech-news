<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admins = [
            [
                'name' => 'Anil Bhattarai (Superadmin 1)',
                'email' => 'anilbhattarai2003@gmail.com',
                'password' => \Illuminate\Support\Facades\Hash::make('SuperAdmin@2026!X'),
                'role' => 'super_admin',
            ],
            [
                'name' => 'Anil Bhattarai (Superadmin 2)',
                'email' => 'theanilbhattarai@gmail.com',
                'password' => \Illuminate\Support\Facades\Hash::make('NepTechNews#Admin99$'),
                'role' => 'super_admin',
            ]
        ];

        foreach ($admins as $admin) {
            \App\Models\User::updateOrCreate(
                ['email' => $admin['email']],
                $admin
            );
        }
    }
}
