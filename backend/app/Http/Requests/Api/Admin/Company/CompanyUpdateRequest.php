<?php

namespace App\Http\Requests\Api\Admin\Company;

use App\Enums\CommonStatusEnum;
use App\Http\Requests\Concerns\NullsBlankStrings;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyUpdateRequest extends FormRequest
{
    use NullsBlankStrings;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        foreach (['email', 'phone_number', 'website_url', 'description', 'address'] as $key) {
            $this->nullIfBlank($key);
        }

        $this->merge([
            'remove_logo' => filter_var($this->input('remove_logo'), FILTER_VALIDATE_BOOLEAN),
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'integer', Rule::in([CommonStatusEnum::ACTIVE->value, CommonStatusEnum::DISABLED->value])],
            'email' => ['nullable', 'email', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:255'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'country_id' => ['required', 'uuid', Rule::exists('countries', 'id')->whereNull('deleted_at')],
            'address' => ['nullable', 'string', 'max:1000'],
            'logo' => ['nullable', 'file', 'mimes:jpeg,png,webp', 'max:2048'],
            'remove_logo' => ['nullable', 'boolean'],
        ];
    }
}
