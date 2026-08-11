<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        // Only return non-sensitive settings to the frontend by default, or return all if super_admin
        // Wait, this is the admin panel endpoint, so they must be super_admin.
        if (request()->user()->role !== 'super_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $settings = \App\Models\Setting::all()->pluck('value', 'key');
        return response()->json(['data' => $settings]);
    }

    public function store(\Illuminate\Http\Request $request)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            \App\Models\Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
