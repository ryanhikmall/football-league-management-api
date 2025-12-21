<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchGame extends Model
{
    use HasFactory;

    // Kita definisikan nama tabelnya eksplisit biar aman
    protected $table = 'matches';

    protected $fillable = [
        'home_team_id',
        'away_team_id',
        'match_date',
        'home_score',
        'away_score',
        'status', // scheduled, finished, live
    ];

    // Relasi ke Tim Tuan Rumah
    public function homeTeam()
    {
        return $this->belongsTo(Team::class, 'home_team_id');
    }

    // Relasi ke Tim Tamu
    public function awayTeam()
    {
        return $this->belongsTo(Team::class, 'away_team_id');
    }

    // Relasi ke Event (Gol, Kartu, dll)
    public function events()
    {
        return $this->hasMany(MatchEvent::class, 'match_id');
    }
}