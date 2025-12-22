<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matches extends Model
{
    use HasFactory;

    // Pastikan nama tabel sesuai dengan di database (biasanya plural)
    protected $table = 'matches';

    // TAMBAHKAN field yang mau di-update ke sini
    protected $fillable = [
        'home_team_id',
        'away_team_id',
        'match_date',
        'home_score', // <--- Wajib ada agar bisa di-update
        'away_score', // <--- Wajib ada agar bisa di-update
        'status',
    ];

    // Relasi ke tabel Teams (Home)
    public function homeTeam()
    {
        return $this->belongsTo(Team::class, 'home_team_id');
    }

    // Relasi ke tabel Teams (Away)
    public function awayTeam()
    {
        return $this->belongsTo(Team::class, 'away_team_id');
    }
}