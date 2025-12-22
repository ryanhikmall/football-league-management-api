<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; // Import ini
use Illuminate\Http\Exceptions\HttpResponseException; // Import ini

class StorePlayerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Pastikan true
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'team_id'       => 'required|exists:teams,id',
            'name'          => 'required|string|max:100',
            'position'      => 'required|in:GK,CB,LB,RB,RWB,LWB,DM,CM,AM,LM,RM,LW,RW,SS,CF,ST',
            'jersey_number' => 'required|integer|min:1|max:99',
        ];
    }

    /**
     * Handle a failed validation attempt.
     * Memaksa response JSON 422 jika validasi gagal (bukan redirect).
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation errors',
            'data'    => $validator->errors()
        ], 422));
    }
}