<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class NewsSyncCommand extends Command
{
    protected $signature = 'news:sync';
    protected $description = 'Sync news from RSS feeds (Native fallback or AI-Powered)';

    public function handle()
    {
        $this->info('Starting News Sync...');
        
        $feeds = [
            ['url' => 'http://feeds.bbci.co.uk/news/technology/rss.xml', 'lang' => 'en', 'cat' => 'technology'],
            ['url' => 'http://feeds.bbci.co.uk/news/business/rss.xml', 'lang' => 'en', 'cat' => 'business'],
            ['url' => 'http://feeds.bbci.co.uk/news/world/rss.xml', 'lang' => 'en', 'cat' => 'world'],
            ['url' => 'http://feeds.bbci.co.uk/sport/rss.xml', 'lang' => 'en', 'cat' => 'sports'],
            ['url' => 'https://www.onlinekhabar.com/feed', 'lang' => 'np', 'cat' => 'national'],
            ['url' => 'https://english.onlinekhabar.com/feed', 'lang' => 'en', 'cat' => 'national'],
        ];

        $superAdmin = \App\Models\User::where('role', 'super_admin')->first();
        if (!$superAdmin) {
            $this->error('No superadmin found to assign articles to.');
            return;
        }

        foreach ($feeds as $feed) {
            $this->info("Fetching: {$feed['url']}");
            try {
                $context = stream_context_create([
                    'http' => [
                        'header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n"
                    ]
                ]);
                $content = file_get_contents($feed['url'], false, $context);
                
                // Fix unescaped ampersands which break simplexml
                $content = preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $content);
                
                libxml_use_internal_errors(true);
                $xml = simplexml_load_string($content, 'SimpleXMLElement', LIBXML_NOCDATA | LIBXML_NOERROR | LIBXML_NOWARNING);
                
                if ($xml === false) {
                    $errors = libxml_get_errors();
                    $this->error("Failed parsing XML: " . ($errors[0]->message ?? 'Unknown error'));
                    libxml_clear_errors();
                    continue;
                }
                
                if (!isset($xml->channel->item)) continue;

                $category = \App\Models\Category::firstOrCreate(
                    ['slug' => $feed['cat']],
                    ['name_en' => ucfirst($feed['cat']), 'name_np' => ucfirst($feed['cat'])]
                );
                
                $count = 0;
                foreach ($xml->channel->item as $item) {
                    if ($count >= 6) break; // Fetch up to 6 per feed
                    $count++;

                    $title = (string) $item->title;
                    $body = (string) $item->description;
                    $slug = \Illuminate\Support\Str::slug($title);

                    // Extract image from standard media:content, enclosure, or media:thumbnail
                    $imageUrl = null;
                    $namespaces = $item->getNamespaces(true);
                    
                    if (isset($namespaces['media'])) {
                        $media = $item->children($namespaces['media']);
                        if (isset($media->content) && isset($media->content->attributes()->url)) {
                            $imageUrl = (string) $media->content->attributes()->url;
                        } elseif (isset($media->thumbnail) && isset($media->thumbnail->attributes()->url)) {
                            $imageUrl = (string) $media->thumbnail->attributes()->url;
                        }
                    }
                    if (!$imageUrl && isset($item->enclosure) && isset($item->enclosure->attributes()->url)) {
                        $imageUrl = (string) $item->enclosure->attributes()->url;
                    }
                    if (!$imageUrl && preg_match('/<img[^>]+src=["\']([^"\']+)["\']/i', (string) $item->description, $matches)) {
                        $imageUrl = $matches[1];
                    }

                    if (\App\Models\Article::where('slug', $slug)->exists()) {
                        continue;
                    }

                    // To make it look "launch ready", we will default to published
                    $articleData = [
                        'slug' => $slug,
                        'author_id' => $superAdmin->id,
                        'category_id' => $category->id,
                        'status' => 'published',
                        'published_at' => now(),
                        'title_en' => $feed['lang'] === 'en' ? $title : $title, // Fallback if translation fails
                        'body_en' => $feed['lang'] === 'en' ? $body : $body,
                        'title_np' => $feed['lang'] === 'np' ? $title : $title,
                        'body_np' => $feed['lang'] === 'np' ? $body : $body,
                        'featured_image' => $imageUrl,
                    ];

                    \App\Models\Article::create($articleData);
                    $this->info("Saved: {$slug}");
                }
            } catch (\Exception $e) {
                $this->error("Failed to parse feed: " . $e->getMessage());
            }
        }
        
        $this->info('News Sync Complete!');
    }
}
