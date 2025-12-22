<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use App\Http\Requests\StoreTeamRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class TeamController extends Controller implements HasMiddleware
{
    // Proteksi: CRUD butuh login, tapi 'index' & 'show' (lihat data) boleh publik
    public static function middleware(): array
    {
        return [
            new Middleware('auth:api', except: ['index', 'show']),
        ];
    }

    public function index()
    {
        return response()->json(Team::all());
    }

    public function store(StoreTeamRequest $request)
    {
        $team = Team::create($request->validated());
        return response()->json(['message' => 'Team created', 'data' => $team], 201);
    }

    public function show($id)
    {
        // Tampilkan detail tim beserta daftar pemainnya
        $team = Team::with('players')->find($id);

        if (!$team) return response()->json(['message' => 'Team not found'], 404);

        return response()->json($team);
    }

    public function update(StoreTeamRequest $request, $id)
    {
        $team = Team::find($id);
        if (!$team) return response()->json(['message' => 'Team not found'], 404);

        $team->update($request->validated());
        return response()->json(['message' => 'Team updated', 'data' => $team]);
    }

    public function destroy($id)
    {
        $team = Team::find($id);
        if (!$team) return response()->json(['message' => 'Team not found'], 404);

        $team->delete();
        return response()->json(['message' => 'Team deleted']);
    }
}