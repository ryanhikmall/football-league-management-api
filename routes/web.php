<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

// Route untuk halaman utama (root) mengarah ke documentation.html
Route::get('/', function () {
    return File::get(public_path() . '/documentation.html');
});

// Route untuk halaman example mengarah ke example.html
Route::get('/example', function () {
    return File::get(public_path() . '/example.html');
});