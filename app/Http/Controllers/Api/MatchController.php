<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller; // Import Controller induk
use App\Models\Matches; 
use App\Http\Requests\StoreMatchRequest; 
use Illuminate\Http\Request;

class MatchController extends Controller
{
    /**
     * Menampilkan daftar semua pertandingan
     */
    public function index()
    {
        // Mengambil semua match beserta data tim home dan away (eager loading)
        $matches = Matches::with(['homeTeam', 'awayTeam'])->get();

        return response()->json([
            'success' => true,
            'message' => 'List of matches',
            'data'    => $matches
        ]);
    }

    /**
     * Menyimpan pertandingan baru
     */
    public function store(StoreMatchRequest $request)
    {
        // Validasi sudah ditangani otomatis oleh StoreMatchRequest
        // Jika lolos, kode di bawah akan dijalankan

        $match = Matches::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Match created successfully',
            'data'    => $match
        ], 201);
    }

    /**
     * Menampilkan detail satu pertandingan
     */
    public function show($id)
    {
        $match = Matches::with(['homeTeam', 'awayTeam'])->find($id);

        if (!$match) {
            return response()->json([
                'success' => false,
                'message' => 'Match not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Match detail',
            'data'    => $match
        ]);
    }

    /**
     * Mengupdate pertandingan (termasuk update skor)
     */
    public function update(Request $request, $id)
    {
        $match = Matches::find($id);

        if (!$match) {
            return response()->json([
                'success' => false,
                'message' => 'Match not found'
            ], 404);
        }

        // Validasi input update (bisa dibuat file Request terpisah jika ingin lebih rapi)
        // 'sometimes' berarti validasi hanya jalan jika field tersebut dikirim
        $validated = $request->validate([
            'home_team_id' => 'sometimes|exists:teams,id|different:away_team_id',
            'away_team_id' => 'sometimes|exists:teams,id|different:home_team_id',
            'match_date'   => 'sometimes|date',
            'home_score'   => 'sometimes|integer|min:0',
            'away_score'   => 'sometimes|integer|min:0',
            'status'       => 'sometimes|string',
        ]);

        // Melakukan update data
        // Pastikan 'home_score' & 'away_score' sudah ada di $fillable pada Model Matches
        $match->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Match updated successfully',
            'data'    => $match
        ]);
    }

    /**
     * Menghapus pertandingan
     */
    public function destroy($id)
    {
        $match = Matches::find($id);

        if (!$match) {
            return response()->json([
                'success' => false,
                'message' => 'Match not found'
            ], 404);
        }

        $match->delete();

        return response()->json([
            'success' => true,
            'message' => 'Match deleted successfully'
        ]);
    }
}