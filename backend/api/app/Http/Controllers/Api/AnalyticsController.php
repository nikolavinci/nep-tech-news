<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function dashboard(Request $request)
    {
        $totalArticles = Article::count();
        $publishedArticles = Article::where('status', 'published')->count();
        $draftArticles = Article::where('status', 'draft')->count();
        $totalUsers = User::count();
        $totalCategories = Category::count();

        $recentArticles = Article::with('author', 'category')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'metrics' => [
                'total_articles' => $totalArticles,
                'published_articles' => $publishedArticles,
                'draft_articles' => $draftArticles,
                'total_users' => $totalUsers,
                'total_categories' => $totalCategories,
            ],
            'recent_articles' => $recentArticles
        ]);
    }
}
