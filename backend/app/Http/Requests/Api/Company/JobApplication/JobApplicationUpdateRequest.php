<?php

namespace App\Http\Requests\Api\Company\JobApplication;

use App\Enums\JobApplicationStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobApplicationUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'job_application_status' => ['required', 'integer', Rule::in(JobApplicationStatusEnum::staffCanSet())],
            'updated_at' => ['required', 'date'],
        ];
    }
}
