<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = \App\Models\User::factory()->create([
            'name' => 'Anil Bhattarai',
            'email' => 'editor@neptechnews.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password123'),
            'role' => 'chief_editor'
        ]);

        $categories = \App\Models\Category::factory(5)->create();

        foreach ($categories as $category) {
            \App\Models\Article::factory(10)->create([
                'author_id' => $user->id,
                'category_id' => $category->id,
            ]);
        }
    }
}
