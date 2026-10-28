<?php

namespace App\Http\Requests\Api\Admin\JobSeeker;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobSeekerUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('job_seekers', 'email')->ignore($this->route('id'))->whereNull('deleted_at')],
            'password' => ['nullable', 'string', 'min:8'],
            'phone_number' => ['nullable', 'string', 'max:255'],
            'gender' => ['nullable', 'integer', Rule::in([1, 2, 9])],
            'date_of_birth' => ['nullable', 'date'],
            'job_seeking_status' => ['nullable', 'integer', Rule::in([1, 2])],
            'status' => ['nullable', 'integer', Rule::in([1, 9])],
        ];
    }
}
