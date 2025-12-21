<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', // <--- Baris ini MEMAKSA Laravel baca api.php
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Mendaftarkan Middleware Activity Logger (CCTV) secara global
        // Pastikan class middleware sudah dibuat sebelumnya
        $middleware->append(\App\Http\Middleware\ActivityLogger::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();