<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // PENTING: Ubah false jadi true
    }

    public function rules(): array
    {
        return [
            'home_team_id' => 'required|exists:teams,id',
            // Validasi: Tim tamu harus beda dengan tuan rumah
            'away_team_id' => 'required|exists:teams,id|different:home_team_id', 
            'match_date'   => 'required|date',
        ];
    }
}