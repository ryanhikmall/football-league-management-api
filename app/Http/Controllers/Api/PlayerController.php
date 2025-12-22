<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Player;
use Illuminate\Http\Request;
use App\Http\Requests\StorePlayerRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PlayerController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:api', except: ['index', 'show']),
        ];
    }

    public function index(Request $request)
    {
        // Fitur Filter: GET /api/players?team_id=1
        if ($request->has('team_id')) {
            return response()->json(Player::where('team_id', $request->team_id)->get());
        }
        
        return response()->json(Player::with('team')->get());
    }

    public function store(StorePlayerRequest $request)
    {
        $player = Player::create($request->validated());
        return response()->json(['message' => 'Player registered', 'data' => $player], 201);
    }

    public function show($id)
    {
        $player = Player::with('team')->find($id);
        if (!$player) return response()->json(['message' => 'Player not found'], 404);
        return response()->json($player);
    }

    public function update(StorePlayerRequest $request, $id)
    {
        $player = Player::find($id);
        if (!$player) return response()->json(['message' => 'Player not found'], 404);

        $player->update($request->validated());
        return response()->json(['message' => 'Player updated', 'data' => $player]);
    }

    public function destroy($id)
    {
        $player = Player::find($id);
        if (!$player) return response()->json(['message' => 'Player not found'], 404);

        $player->delete();
        return response()->json(['message' => 'Player removed']);
    }
}