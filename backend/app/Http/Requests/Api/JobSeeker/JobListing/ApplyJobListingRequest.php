<?php

namespace App\Http\Requests\Api\JobSeeker\JobListing;

use Illuminate\Foundation\Http\FormRequest;

class ApplyJobListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cover_letter' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
