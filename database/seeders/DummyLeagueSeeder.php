<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DummyLeagueSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat User Admin (Biar bisa login)
        if (!DB::table('users')->where('email', 'admin@league.com')->exists()) {
            DB::table('users')->insert([
                'name' => 'Super Admin',
                'email' => 'admin@league.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 2. Buat 3 Tim Dummy
        $teams = [
            ['name' => 'Garuda FC', 'home_base' => 'GBK Senayan'],
            ['name' => 'Rajawali United', 'home_base' => 'Stadion Pakansari'],
            ['name' => 'Bintang Timur', 'home_base' => 'Gora Mataram'],
        ];

        foreach ($teams as $team) {
            $teamId = DB::table('teams')->insertGetId([
                'name' => $team['name'],
                'home_base' => $team['home_base'],
                'logo_url' => '[https://placehold.co/100x100?text=](https://placehold.co/100x100?text=)' . urlencode($team['name']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 3. Buat 5 Pemain Dummy per Tim
            for ($i = 1; $i <= 5; $i++) {
                DB::table('players')->insert([
                    'team_id' => $teamId,
                    'name' => $team['name'] . ' Player ' . $i,
                    'position' => ['FW', 'MF', 'DF', 'GK'][rand(0, 3)],
                    'jersey_number' => rand(1, 99),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}