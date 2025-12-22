<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'logo_url', 'home_base'];

    // Relasi: 1 Tim -> Banyak Players
    public function players()
    {
        // PERBAIKAN: Gunakan ::class (double colon), bukan .class
        return $this->hasMany(Player::class);
    }
}