<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // WAJIB TRUE
    }

    public function rules(): array
    {
        // Validasi: Nama tim unik, logo harus URL valid
        return [
            'name'      => 'required|string|max:50|unique:teams,name,' . $this->id,
            'logo_url'  => 'nullable|url',
            'home_base' => 'nullable|string|max:100',
        ];
    }
}