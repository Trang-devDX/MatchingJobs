<?php

namespace App\Http\Requests\Api\Company\JobListing;

use App\Enums\JobListingStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class JobListingUpdateRequest extends FormRequest
{
    use JobListingFields;

    private bool $closeOnly = false;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->closeOnly = (int) $this->input('job_listings_status') === JobListingStatusEnum::CLOSED->value
            && array_diff(array_keys($this->all()), ['job_listings_status', 'updated_at']) === [];

        if (! $this->closeOnly) {
            $this->prepareListing($this);
        }
    }

    public function rules(): array
    {
        if ($this->closeOnly) {
            return [
                'updated_at' => ['required', 'date'],
                'job_listings_status' => ['required', 'integer', Rule::in([JobListingStatusEnum::CLOSED->value])],
            ];
        }

        return [
            'updated_at' => ['required', 'date'],
            'job_listings_status' => ['required', 'integer', Rule::in([
                JobListingStatusEnum::PUBLISHED->value,
                JobListingStatusEnum::DRAFT->value,
                JobListingStatusEnum::CLOSED->value,
            ])],
            ...$this->listingRules(false),
        ];
    }

    public function withValidator(Validator $validator): void
    {
        if ($this->closeOnly) {
            return;
        }

        $this->validateListing($validator, $this);
    }
}
