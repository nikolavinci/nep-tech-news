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
            ['url' => 'https://techlekh.com/feed/', 'lang' => 'en'],
            // Note: OnlineKhabar feed often changes, using standard format
            ['url' => 'https://www.onlinekhabar.com/feed', 'lang' => 'np'],
        ];

        $superAdmin = \App\Models\User::where('role', 'super_admin')->first();
        if (!$superAdmin) {
            $this->error('No superadmin found to assign articles to.');
            return;
        }

        $category = \App\Models\Category::firstOrCreate(
            ['slug' => 'news'],
            ['name_en' => 'News', 'name_np' => 'समाचार']
        );

        $provider = \App\Models\Setting::where('key', 'ai_provider')->value('value');
        $apiKey = \App\Models\Setting::where('key', 'ai_api_key')->value('value');

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
                
                $count = 0;
                foreach ($xml->channel->item as $item) {
                    if ($count >= 5) break; // Limit to 5 per feed for now
                    $count++;

                    $title = (string) $item->title;
                    $body = (string) $item->description;
                    $slug = \Illuminate\Support\Str::slug($title);

                    if (\App\Models\Article::where('slug', $slug)->exists()) {
                        continue;
                    }

                    $articleData = [
                        'slug' => $slug,
                        'author_id' => $superAdmin->id,
                        'category_id' => $category->id,
                        'status' => 'draft',
                        'title_en' => $feed['lang'] === 'en' ? $title : 'Draft: ' . $title,
                        'body_en' => $feed['lang'] === 'en' ? $body : 'Draft content pending translation.',
                        'title_np' => $feed['lang'] === 'np' ? $title : null,
                        'body_np' => $feed['lang'] === 'np' ? $body : null,
                    ];

                    // AI Processing
                    if ($provider === 'openai' && $apiKey) {
                        $this->info("Spinning article via OpenAI...");
                        $prompt = "You are an expert journalist. Rewrite this article to completely avoid plagiarism. Remove any mention of the source brand. Translate it into both English and Nepali. Return a valid JSON object strictly with these keys: title_en, title_np, body_en, body_np.\n\nOriginal Text:\n" . $title . "\n" . strip_tags($body);
                        
                        $response = \Illuminate\Support\Facades\Http::withToken($apiKey)
                            ->timeout(60)
                            ->post('https://api.openai.com/v1/chat/completions', [
                                'model' => 'gpt-4o-mini',
                                'response_format' => ['type' => 'json_object'],
                                'messages' => [
                                    ['role' => 'user', 'content' => $prompt]
                                ]
                            ]);

                        if ($response->successful()) {
                            $aiResult = json_decode($response->json('choices.0.message.content'), true);
                            if ($aiResult && isset($aiResult['title_en'])) {
                                $articleData['title_en'] = $aiResult['title_en'];
                                $articleData['title_np'] = $aiResult['title_np'];
                                $articleData['body_en'] = $aiResult['body_en'];
                                $articleData['body_np'] = $aiResult['body_np'];
                                $articleData['status'] = 'published';
                                $articleData['published_at'] = now();
                            }
                        }
                    }

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
