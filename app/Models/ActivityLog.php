<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'url',
        'description',
        'ip_address',
        'request_data',
    ];

    // Relasi ke User (biar tahu siapa pelakunya)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
