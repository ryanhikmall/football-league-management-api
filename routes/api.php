<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MatchController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\PlayerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Test Route sederhana
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

// --- GROUP 1: AUTHENTICATION (Komang) ---
// Prefix URL: /api/auth/...
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);
});

/*
|--------------------------------------------------------------------------
| Syaihul's Routes (Matches & Standings)
|--------------------------------------------------------------------------
*/
Route::apiResource('matches', MatchController::class);
// Endpoint Standings (Manual Get)
Route::get('/standings', [MatchController::class, 'standings']); // Pastikan method standings ada di controller nanti

/*
|--------------------------------------------------------------------------
| Ryan's Routes (Teams & Players)
|--------------------------------------------------------------------------
*/
Route::apiResource('teams', TeamController::class);
Route::apiResource('players', PlayerController::class);