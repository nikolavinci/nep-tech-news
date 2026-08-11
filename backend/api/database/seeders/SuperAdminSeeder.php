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
        // --- Default Categories ---
        $categories = [
            'technology' => ['en' => 'Technology', 'np' => 'प्रविधि'],
            'business' => ['en' => 'Business', 'np' => 'व्यापार'],
            'world' => ['en' => 'World', 'np' => 'विश्व'],
            'sports' => ['en' => 'Sports', 'np' => 'खेलकुद'],
            'national' => ['en' => 'National', 'np' => 'राष्ट्रिय'],
        ];

        $categoryIds = [];
        foreach ($categories as $slug => $names) {
            $cat = \App\Models\Category::firstOrCreate(
                ['slug' => $slug],
                ['name_en' => $names['en'], 'name_np' => $names['np']]
            );
            $categoryIds[$slug] = $cat->id;
        }

        // --- Default RSS Feeds ---
        if (\Illuminate\Support\Facades\Schema::hasTable('rss_feeds') && \App\Models\RssFeed::count() === 0) {
            $defaultFeeds = [
                ['name' => 'BBC Technology', 'url' => 'http://feeds.bbci.co.uk/news/technology/rss.xml', 'lang' => 'en', 'cat' => 'technology'],
                ['name' => 'BBC Business', 'url' => 'http://feeds.bbci.co.uk/news/business/rss.xml', 'lang' => 'en', 'cat' => 'business'],
                ['name' => 'BBC World', 'url' => 'http://feeds.bbci.co.uk/news/world/rss.xml', 'lang' => 'en', 'cat' => 'world'],
                ['name' => 'BBC Sports', 'url' => 'http://feeds.bbci.co.uk/sport/rss.xml', 'lang' => 'en', 'cat' => 'sports'],
                ['name' => 'OnlineKhabar', 'url' => 'https://www.onlinekhabar.com/feed', 'lang' => 'np', 'cat' => 'national'],
                ['name' => 'OnlineKhabar English', 'url' => 'https://english.onlinekhabar.com/feed', 'lang' => 'en', 'cat' => 'national'],
                ['name' => 'Nagarik News', 'url' => 'https://nagariknews.nagariknetwork.com/feed', 'lang' => 'np', 'cat' => 'national'],
                ['name' => 'Ratopati', 'url' => 'https://www.ratopati.com/feed', 'lang' => 'np', 'cat' => 'national'],
                ['name' => 'Telegraph Nepal', 'url' => 'https://www.telegraphnepal.com/feed/', 'lang' => 'en', 'cat' => 'national'],
                ['name' => 'The Himalayan Times', 'url' => 'https://www.thehimalayantimes.com/rss', 'lang' => 'en', 'cat' => 'national'],
                ['name' => 'Artha Sarokar', 'url' => 'https://arthasarokar.com/feed', 'lang' => 'np', 'cat' => 'business'],
                ['name' => 'Techmandu', 'url' => 'https://techmandu.com/feed/', 'lang' => 'en', 'cat' => 'technology'],
            ];

            foreach ($defaultFeeds as $feed) {
                \App\Models\RssFeed::create([
                    'name' => $feed['name'],
                    'url' => $feed['url'],
                    'lang' => $feed['lang'],
                    'category_id' => $categoryIds[$feed['cat']] ?? null,
                    'is_active' => true,
                ]);
            }
        }
    }
}
