<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MatchGame;
use Illuminate\Http\Request;
use App\Http\Requests\StoreMatchRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class MatchController extends Controller implements HasMiddleware
{
    // Pasang middleware Auth, kecuali untuk lihat jadwal (index/show)
    public static function middleware(): array
    {
        return [
            new Middleware('auth:api', except: ['index', 'show']),
        ];
    }

    // GET /matches
    public function index()
    {
        $matches = MatchGame::with(['homeTeam', 'awayTeam'])
            ->orderBy('match_date', 'asc')
            ->get();

        return response()->json($matches);
    }

    // POST /matches
    public function store(StoreMatchRequest $request)
    {
        $match = MatchGame::create([
            'home_team_id' => $request->home_team_id,
            'away_team_id' => $request->away_team_id,
            'match_date'   => $request->match_date,
            'home_score'   => 0,
            'away_score'   => 0,
            'status'       => 'scheduled',
        ]);

        return response()->json([
            'message' => 'Match scheduled successfully',
            'data'    => $match
        ], 201);
    }

    // GET /matches/{id}
    public function show($id)
    {
        $match = MatchGame::with(['homeTeam', 'awayTeam', 'events.player'])->find($id);

        if (!$match) return response()->json(['message' => 'Match not found'], 404);

        return response()->json($match);
    }
    
    // PUT /matches/{id}
    public function update(Request $request, $id)
    {
        $match = MatchGame::find($id);
        if (!$match) return response()->json(['message' => 'Match not found'], 404);

        $match->update($request->only(['status', 'match_date']));

        return response()->json(['message' => 'Match updated', 'data' => $match]);
    }
}