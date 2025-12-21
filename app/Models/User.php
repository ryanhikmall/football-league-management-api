<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject; // Tambahkan ini

class User extends Authenticatable implements JWTSubject // Implement ini
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // Pastikan role masuk fillable
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Wajib untuk JWT
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    // Wajib untuk JWT (bisa custom payload)
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role, // Kita simpan role di token biar gampang diakses frontend
        ];
    }
}