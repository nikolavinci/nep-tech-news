<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\Category::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_en' => 'required|string|max:255',
            'name_np' => 'required|string|max:255',
        ]);
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name_en']);
        $category = \App\Models\Category::create($validated);
        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = \App\Models\Category::findOrFail($id);
        $validated = $request->validate([
            'name_en' => 'sometimes|required|string|max:255',
            'name_np' => 'sometimes|required|string|max:255',
        ]);
        if ($request->has('name_en') && $request->name_en !== $category->name_en) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['name_en']);
        }
        $category->update($validated);
        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = \App\Models\Category::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }
}
