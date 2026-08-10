<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $media = Media::orderBy('created_at', 'desc')->paginate(24);
        return response()->json($media);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB Max
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9_.-]/', '', $file->getClientOriginalName());
            
            // Store file in storage/app/public/media
            $filePath = $file->storeAs('media', $fileName, 'public');

            $media = Media::create([
                'user_id' => $request->user()->id,
                'file_name' => $fileName,
                'file_path' => '/storage/' . $filePath,
                'mime_type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
            ]);

            return response()->json([
                'message' => 'File uploaded successfully',
                'url' => url('/storage/' . $filePath),
                'media' => $media
            ], 201);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }
}
