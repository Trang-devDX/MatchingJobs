<?php

namespace App\Http\Requests\Api\Company\JobListing;

use App\Enums\JobListingStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class JobListingStoreRequest extends FormRequest
{
    use JobListingFields;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->prepareListing($this);
    }

    public function rules(): array
    {
        return [
            'job_listings_status' => ['required', 'integer', Rule::in(JobListingStatusEnum::allowedForCreate())],
            ...$this->listingRules(true),
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $this->validateListing($validator, $this);
    }
}
