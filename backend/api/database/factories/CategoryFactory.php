<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nameEn = fake()->unique()->word();
        return [
            'slug' => \Illuminate\Support\Str::slug($nameEn),
            'name_en' => ucfirst($nameEn),
            'name_np' => 'नेपाली ' . ucfirst($nameEn),
            'parent_id' => null,
        ];
    }
}
