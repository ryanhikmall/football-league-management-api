<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Matches;
use App\Models\Team; // <-- Baris ini PENTING agar error "Class not found" hilang
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

    /**
     * Melihat Klasemen (Standings)
     */
    public function standings()
    {
        $teams = Team::all();
        $matches = Matches::where('status', 'finished')->get();

        $standings = [];

        // Inisialisasi data tiap tim
        foreach ($teams as $team) {
            $standings[$team->id] = [
                'team_id' => $team->id,
                'team_name' => $team->name,
                'played' => 0,
                'won' => 0,
                'drawn' => 0,
                'lost' => 0,
                'gf' => 0,
                'ga' => 0,
                'gd' => 0,
                'points' => 0,
            ];
        }

        // Hitung poin dari setiap match yang selesai
        foreach ($matches as $match) {
            // Hitung untuk Home Team
            if (isset($standings[$match->home_team_id])) {
                $stats = &$standings[$match->home_team_id];
                $stats['played']++;
                $stats['gf'] += $match->home_score;
                $stats['ga'] += $match->away_score;

                if ($match->home_score > $match->away_score) {
                    $stats['won']++;
                    $stats['points'] += 3;
                } elseif ($match->home_score == $match->away_score) {
                    $stats['drawn']++;
                    $stats['points'] += 1;
                } else {
                    $stats['lost']++;
                }
            }

            // Hitung untuk Away Team
            if (isset($standings[$match->away_team_id])) {
                $stats = &$standings[$match->away_team_id];
                $stats['played']++;
                $stats['gf'] += $match->away_score;
                $stats['ga'] += $match->home_score;

                if ($match->away_score > $match->home_score) {
                    $stats['won']++;
                    $stats['points'] += 3;
                } elseif ($match->away_score == $match->home_score) {
                    $stats['drawn']++;
                    $stats['points'] += 1;
                } else {
                    $stats['lost']++;
                }
            }
        }

        // Hitung selisih gol (GD) dan urutkan (Sort by Points desc, then GD desc)
        $sortedStandings = collect($standings)->map(function($team) {
            $team['gd'] = $team['gf'] - $team['ga'];
            return $team;
        })->sortByDesc(function ($item) {
            return [$item['points'], $item['gd']];
        })->values();

        return response()->json([
            'success' => true,
            'message' => 'Current Standings',
            'data' => $sortedStandings
        ]);
    }
}