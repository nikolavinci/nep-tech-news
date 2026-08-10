<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\Article::with('category', 'author');

        if ($request->has('q') && !empty($request->q)) {
            $searchTerm = '%' . $request->q . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('title_en', 'LIKE', $searchTerm)
                  ->orWhere('title_np', 'LIKE', $searchTerm)
                  ->orWhere('body_en', 'LIKE', $searchTerm)
                  ->orWhere('body_np', 'LIKE', $searchTerm);
            });
            // When searching from public frontend, we typically only want published articles
            // We can optionally check if this is an admin request, but for MVP let's assume public search
            $query->where('status', 'published');
        }

        $articles = $query->orderBy('published_at', 'desc')->paginate(12);
        
        return response()->json($articles);
    }

    public function show($slug)
    {
        $article = \App\Models\Article::with('category', 'author')
            ->where('slug', $slug)
            ->orWhere('id', $slug)
            ->firstOrFail();
        return response()->json($article);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_np' => 'required|string|max:255',
            'body_en' => 'required|string',
            'body_np' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date'
        ]);

        $validated['author_id'] = $request->user()->id;
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['title_en']) . '-' . uniqid();

        $article = \App\Models\Article::create($validated);

        return response()->json($article->load('category', 'author'), 201);
    }

    public function update(Request $request, $id)
    {
        $article = \App\Models\Article::findOrFail($id);

        $validated = $request->validate([
            'title_en' => 'sometimes|required|string|max:255',
            'title_np' => 'sometimes|required|string|max:255',
            'body_en' => 'sometimes|required|string',
            'body_np' => 'sometimes|required|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'status' => 'sometimes|required|in:draft,published',
            'published_at' => 'nullable|date'
        ]);

        if ($request->has('title_en') && $request->title_en !== $article->title_en) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['title_en']) . '-' . uniqid();
        }

        $article->update($validated);

        return response()->json($article->load('category', 'author'));
    }

    public function destroy($id)
    {
        $article = \App\Models\Article::findOrFail($id);
        $article->delete();
        
        return response()->json(['message' => 'Article deleted successfully']);
    }
}
