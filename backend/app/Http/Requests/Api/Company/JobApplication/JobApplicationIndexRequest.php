<?php

namespace App\Http\Requests\Api\Company\JobApplication;

use App\Enums\JobApplicationStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobApplicationIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'job_listing_id' => ['nullable', 'uuid'],
            'job_application_status' => ['nullable', 'integer', Rule::enum(JobApplicationStatusEnum::class)],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
