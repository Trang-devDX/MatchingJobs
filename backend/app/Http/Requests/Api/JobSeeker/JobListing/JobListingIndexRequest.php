<?php

namespace App\Http\Requests\Api\JobSeeker\JobListing;

use Illuminate\Foundation\Http\FormRequest;

class JobListingIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
