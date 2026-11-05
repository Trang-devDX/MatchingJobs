<?php

namespace App\Http\Requests\Api\Company\JobListing;

use App\Enums\JobListingStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class JobListingIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $dates = [];
        foreach (['date_from' => 'startOfDay', 'date_end' => 'endOfDay'] as $key => $boundary) {
            if (! $this->filled($key)) {
                continue;
            }
            try {
                $dates[$key] = Carbon::parse($this->input($key))->{$boundary}()->toDateTimeString();
            } catch (\Throwable) {
                // Leave the original value so the date rule can reject it.
            }
        }
        if ($dates !== []) {
            $this->merge($dates);
        }
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'job_listings_status' => ['nullable', 'integer', Rule::in([
                JobListingStatusEnum::PUBLISHED->value,
                JobListingStatusEnum::DRAFT->value,
                JobListingStatusEnum::CLOSED->value,
            ])],
            'type_id' => ['nullable', 'uuid'],
            'date_from' => ['nullable', 'date'],
            'date_end' => ['nullable', 'date', 'after_or_equal:date_from'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
