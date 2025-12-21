<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class ActivityLogger
{
    public function handle(Request $request, Closure $next)
    {
        // 1. Lanjutkan request dulu biar diproses controller (dan user ter-autentikasi)
        $response = $next($request);

        // 2. Filter: Kita hanya catat method yang mengubah data (POST, PUT, DELETE)
        // Atau jika spesifik ingin mencatat Login (biasanya POST)
        if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {

            // Cek apakah request berhasil (status 2xx)
            if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {

                try {
                    ActivityLog::create([
                        'user_id' => Auth::check() ? Auth::id() : null, // Ambil ID jika login
                        'action'  => $request->method(),
                        'url'     => $request->fullUrl(),
                        'description' => 'User accessing ' . $request->path(),
                        'ip_address' => $request->ip(),
                        // Hati-hati menyimpan password! Kita filter 'password' dari request
                        'request_data' => json_encode($request->except(['password', 'password_confirmation'])),
                    ]);
                } catch (\Exception $e) {
                    // Jangan sampai error logging menghentikan aplikasi
                    // Biarkan kosong atau log ke laravel.log
                }
            }
        }

        return $response;
    }
}