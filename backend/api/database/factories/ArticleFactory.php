<?php

namespace Database\Factories;

use App\Models\Article;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Article>
 */
class ArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $titleEn = fake()->sentence();
        return [
            'author_id' => \App\Models\User::factory(),
            'category_id' => \App\Models\Category::factory(),
            'slug' => \Illuminate\Support\Str::slug($titleEn) . '-' . fake()->unique()->numberBetween(100, 9999),
            'title_en' => $titleEn,
            'title_np' => 'नेपाली शीर्षक ' . fake()->words(3, true),
            'body_en' => '<p>' . implode('</p><p>', fake()->paragraphs(5)) . '</p>',
            'body_np' => '<p>नेपाली लेखको नमुना अनुच्छेद यहाँ राखिएको छ। यो एक परीक्षण मात्र हो।</p>',
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'version' => 1,
        ];
    }
}
