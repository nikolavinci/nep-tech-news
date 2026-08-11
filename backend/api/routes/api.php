<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
    Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
    Route::post('/social-login', [\App\Http\Controllers\Api\AuthController::class, 'socialLogin']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [\App\Http\Controllers\Api\AuthController::class, 'me']);
        Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/articles', [\App\Http\Controllers\Api\ArticleController::class, 'store']);
    Route::put('/articles/{id}', [\App\Http\Controllers\Api\ArticleController::class, 'update']);
    Route::delete('/articles/{id}', [\App\Http\Controllers\Api\ArticleController::class, 'destroy']);

    Route::post('/categories', [\App\Http\Controllers\Api\CategoryController::class, 'store']);
    Route::put('/categories/{id}', [\App\Http\Controllers\Api\CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [\App\Http\Controllers\Api\CategoryController::class, 'destroy']);

    Route::get('/media', [\App\Http\Controllers\Api\MediaController::class, 'index']);
    Route::post('/media/upload', [\App\Http\Controllers\Api\MediaController::class, 'upload']);
    
    // Settings (Superadmin only)
    Route::get('/settings', [\App\Http\Controllers\SettingController::class, 'index']);
    Route::post('/settings', [\App\Http\Controllers\SettingController::class, 'store']);

    Route::get('/analytics/dashboard', [\App\Http\Controllers\Api\AnalyticsController::class, 'dashboard']);
});

Route::get('/categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);
Route::get('/articles', [\App\Http\Controllers\Api\ArticleController::class, 'index']);
Route::get('/articles/{slug}', [\App\Http\Controllers\Api\ArticleController::class, 'show']);
