<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RssFeed;

class RssFeedController extends Controller
{
    public function index()
    {
        return response()->json(RssFeed::with('category')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url|unique:rss_feeds,url',
            'lang' => 'required|string|max:10',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
        ]);

        $feed = RssFeed::create($validated);
        return response()->json($feed->load('category'), 201);
    }

    public function update(Request $request, $id)
    {
        $feed = RssFeed::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'url' => 'sometimes|required|url|unique:rss_feeds,url,' . $id,
            'lang' => 'sometimes|required|string|max:10',
            'category_id' => 'sometimes|required|exists:categories,id',
            'is_active' => 'boolean',
        ]);

        $feed->update($validated);
        return response()->json($feed->load('category'));
    }

    public function destroy($id)
    {
        $feed = RssFeed::findOrFail($id);
        $feed->delete();
        return response()->json(['message' => 'Feed deleted successfully']);
    }
}
