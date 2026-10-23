<?php

namespace App\Http\Requests\Api\Admin\Auth;

use Illuminate\Foundation\Http\FormRequest;

class DeviceTokenUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'token' => ['required', 'string'],
        ];
    }
}
