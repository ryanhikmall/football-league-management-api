<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MatchController;
use App\Http\Controllers\Api\TeamController;   
use App\Http\Controllers\Api\PlayerController;

// Test Route sederhana untuk memastikan file terbaca
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

// Group Auth
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);


    /*
    |--------------------------------------------------------------------------
    | Syaihul's Routes (Matches)
    |--------------------------------------------------------------------------
    */
    Route::apiResource('matches', MatchController::class);


    /*
|--------------------------------------------------------------------------
| Ryan's Routes (Teams & Players)
|--------------------------------------------------------------------------
*/
Route::apiResource('teams', TeamController::class);
Route::apiResource('players', PlayerController::class);
});