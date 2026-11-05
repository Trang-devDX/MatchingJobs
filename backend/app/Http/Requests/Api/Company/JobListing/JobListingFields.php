<?php

namespace App\Http\Requests\Api\Company\JobListing;

use App\Enums\ExperienceLevelEnum;
use App\Enums\PayFrequencyEnum;
use App\Enums\SalaryTypeEnum;
use App\Enums\SalaryUnitEnum;
use App\Http\Requests\Concerns\NullsBlankStrings;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

trait JobListingFields
{
    use NullsBlankStrings;

    protected function prepareListing(FormRequest $request): void
    {
        foreach ([
            'description', 'requirements', 'required_qualification', 'responsibilities', 'benefits',
            'salary_min', 'salary_max', 'salary_unit', 'pay_frequency', 'salary_type', 'experience_level',
            'location', 'address', 'latitude', 'longitude', 'external_application_url', 'quantity',
            'published_at', 'expired_at',
        ] as $key) {
            $request->nullIfBlank($key);
        }

        $skills = array_values(array_filter(array_map(
            fn ($skill) => trim((string) $skill),
            (array) $request->input('skills', []),
        ), fn (string $skill) => $skill !== ''));

        $request->merge([
            'skills' => $skills,
            'industry_ids' => array_values((array) $request->input('industry_ids', [])),
            'category_ids' => array_values((array) $request->input('category_ids', [])),
            'type_ids' => array_values((array) $request->input('type_ids', [])),
            'education_level_ids' => array_values((array) $request->input('education_level_ids', [])),
            'priority_status' => $request->input('priority_status', 2),
            'is_internal_application' => $request->has('is_internal_application')
                ? $request->boolean('is_internal_application')
                : true,
            'use_company_address' => $request->boolean('use_company_address'),
        ]);
    }

    protected function listingRules(bool $creating): array
    {
        return [
            'priority_status' => ['required', 'integer', Rule::in([1, 2, 3])],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:20000'],
            'requirements' => ['nullable', 'string', 'max:20000'],
            'required_qualification' => ['nullable', 'string', 'max:20000'],
            'responsibilities' => ['nullable', 'string', 'max:20000'],
            'benefits' => ['nullable', 'string', 'max:20000'],
            'salary_min' => ['nullable', 'numeric', 'min:0'],
            'salary_max' => ['nullable', 'numeric', 'min:0'],
            'salary_type' => ['nullable', 'integer', Rule::in(SalaryTypeEnum::values())],
            'salary_unit' => ['nullable', 'integer', Rule::in(SalaryUnitEnum::values())],
            'pay_frequency' => ['nullable', 'integer', Rule::in(PayFrequencyEnum::values())],
            'experience_level' => ['nullable', 'integer', Rule::in(ExperienceLevelEnum::values())],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'use_company_address' => ['boolean'],
            'country_id' => ['required', 'uuid', Rule::exists('countries', 'id')->whereNull('deleted_at')],
            'island_id' => ['required', 'uuid', Rule::exists('islands', 'id')->whereNull('deleted_at')],
            'town_id' => ['required', 'uuid', Rule::exists('towns', 'id')->whereNull('deleted_at')],
            'location' => ['nullable', 'string', 'max:2000'],
            'address' => ['nullable', 'string', 'max:2000'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'is_internal_application' => ['boolean'],
            'external_application_url' => ['nullable', 'url', 'max:255'],
            'published_at' => array_values(array_filter([
                'nullable',
                'date',
                $creating ? 'after_or_equal:today' : null,
            ])),
            'expired_at' => ['nullable', 'date'],
            'industry_ids' => ['array'],
            'industry_ids.*' => ['uuid', Rule::exists('job_industries', 'id')->whereNull('deleted_at')],
            'category_ids' => ['array'],
            'category_ids.*' => ['uuid', Rule::exists('job_categories', 'id')->whereNull('deleted_at')],
            'type_ids' => ['array'],
            'type_ids.*' => ['uuid', Rule::exists('job_types', 'id')->whereNull('deleted_at')],
            'education_level_ids' => ['array'],
            'education_level_ids.*' => ['uuid', Rule::exists('education_levels', 'id')->whereNull('deleted_at')],
            'skills' => ['array'],
            'skills.*' => ['string', 'max:200'],
        ];
    }

    protected function validateListing(Validator $validator, FormRequest $request): void
    {
        $validator->after(function (Validator $validator) use ($request): void {
            $min = $request->input('salary_min');
            $max = $request->input('salary_max');
            if ($min !== null && $max !== null && (float) $max < (float) $min) {
                $validator->errors()->add('salary_max', 'The maximum salary must be greater than or equal to the minimum salary.');
            }

            $publishedAt = $request->input('published_at');
            $expiredAt = $request->input('expired_at');
            if ($publishedAt && $expiredAt && strtotime((string) $expiredAt) <= strtotime((string) $publishedAt)) {
                $validator->errors()->add('expired_at', 'The expiry date must be after the publish date.');
            }

            $islandId = $request->input('island_id');
            $countryId = $request->input('country_id');
            if ($islandId && $countryId && ! \App\Models\Island::query()->whereKey($islandId)->where('country_id', $countryId)->exists()) {
                $validator->errors()->add('island_id', 'The selected island does not belong to the country.');
            }

            $townId = $request->input('town_id');
            if ($townId && $islandId && ! \App\Models\Town::query()->whereKey($townId)->where('island_id', $islandId)->exists()) {
                $validator->errors()->add('town_id', 'The selected town does not belong to the island.');
            }

            if ($request->boolean('is_internal_application') === false && blank($request->input('external_application_url'))) {
                $validator->errors()->add('external_application_url', 'An external application URL is required.');
            }
        });
    }
}
