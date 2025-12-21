<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // PERBAIKAN: Ganti 'between(2,100)' menjadi 'between:2,100'
            'name' => 'required|string|between:2,100',
            
            'email' => 'required|string|email|max:100|unique:users',
            
            // PERBAIKAN: Ganti 'min(6)' menjadi 'min:6'
            'password' => 'required|string|min:6',
            
            'role' => 'nullable|in:admin,operator',
        ];
    }
}