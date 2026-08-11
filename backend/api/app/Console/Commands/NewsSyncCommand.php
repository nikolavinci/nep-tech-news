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
        
        $feeds = \App\Models\RssFeed::with('category')->where('is_active', true)->get();

        if ($feeds->isEmpty()) {
            $this->warn('No active RSS feeds found in the database. Please add some via the admin dashboard.');
            return;
        }

        $superAdmin = \App\Models\User::where('role', 'super_admin')->first();
        if (!$superAdmin) {
            $this->error('No superadmin found to assign articles to.');
            return;
        }

        foreach ($feeds as $feed) {
            $this->info("Fetching: {$feed->url}");
            try {
                $context = stream_context_create([
                    'http' => [
                        'header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n"
                    ]
                ]);
                $content = file_get_contents($feed->url, false, $context);
                
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

                $count = 0;
                foreach ($xml->channel->item as $item) {
                    if ($count >= 10) break; // Fetch up to 10 per feed
                    $count++;

                    $title = (string) $item->title;
                    
                    // Try to get full content if available, fallback to description
                    $namespaces = $item->getNamespaces(true);
                    $body = (string) $item->description;
                    if (isset($namespaces['content'])) {
                        $contentNamespace = $item->children($namespaces['content']);
                        if (isset($contentNamespace->encoded) && !empty((string) $contentNamespace->encoded)) {
                            $body = (string) $contentNamespace->encoded;
                        }
                    }
                    
                    $slug = \Illuminate\Support\Str::slug($title);

                    // Extract image from standard media:content, enclosure, or media:thumbnail
                    $imageUrl = null;
                    
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

                    $localImagePath = null;
                    if ($imageUrl) {
                        try {
                            $imageContext = stream_context_create([
                                'http' => ['header' => "User-Agent: Mozilla/5.0\r\n"]
                            ]);
                            $imageContent = file_get_contents($imageUrl, false, $imageContext);
                            if ($imageContent) {
                                $image = @imagecreatefromstring($imageContent);
                                if ($image) {
                                    $filename = "{$slug}.webp";
                                    $savePath = storage_path("app/public/articles/{$filename}");
                                    
                                    if (!is_dir(storage_path('app/public/articles'))) {
                                        mkdir(storage_path('app/public/articles'), 0755, true);
                                    }
                                    
                                    imagewebp($image, $savePath, 80);
                                    imagedestroy($image);
                                    $localImagePath = "/storage/articles/{$filename}";
                                }
                            }
                        } catch (\Exception $e) {
                            $this->warn("Failed to download or convert image for {$slug}: " . $e->getMessage());
                            // Fallback to original URL if processing fails
                            $localImagePath = $imageUrl; 
                        }
                    }

                    if (\App\Models\Article::where('slug', $slug)->exists()) {
                        continue;
                    }

                    // To make it look "launch ready", we will default to published
                    $articleData = [
                        'slug' => $slug,
                        'author_id' => $superAdmin->id,
                        'category_id' => $feed->category_id,
                        'status' => 'published',
                        'published_at' => now(),
                        'title_en' => $feed->lang === 'en' ? $title : $title,
                        'body_en' => $feed->lang === 'en' ? $body : $body,
                        'title_np' => $feed->lang === 'np' ? $title : $title,
                        'body_np' => $feed->lang === 'np' ? $body : $body,
                        'featured_image' => $localImagePath,
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
