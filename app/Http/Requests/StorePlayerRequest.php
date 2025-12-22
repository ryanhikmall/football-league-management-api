<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePlayerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // WAJIB TRUE
    }

    public function rules(): array
    {
        return [
            'team_id'       => 'required|exists:teams,id', // Tim harus ada di DB
            'name'          => 'required|string|max:100',
            'position'      => 'required|in:GK,DF,MF,FW', // Posisi standar
            'jersey_number' => 'required|integer|min:1|max:99',
        ];
    }
}