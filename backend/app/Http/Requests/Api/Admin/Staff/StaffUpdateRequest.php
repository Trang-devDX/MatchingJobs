<?php

namespace App\Http\Requests\Api\Admin\Staff;

use App\Enums\CommonStatusEnum;
use App\Http\Requests\Concerns\NullsBlankStrings;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StaffUpdateRequest extends FormRequest
{
    use NullsBlankStrings;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        foreach (['middle_name', 'phone_number', 'position', 'password'] as $key) {
            $this->nullIfBlank($key);
        }

        $this->merge([
            'is_root' => filter_var($this->input('is_root'), FILTER_VALIDATE_BOOLEAN),
            'remove_avatar' => filter_var($this->input('remove_avatar'), FILTER_VALIDATE_BOOLEAN),
        ]);
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('staffs', 'email')->whereNull('deleted_at')->ignore($this->route('staffId')),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'phone_number' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'integer', Rule::in([CommonStatusEnum::ACTIVE->value, CommonStatusEnum::DISABLED->value])],
            'is_root' => ['nullable', 'boolean'],
            'avatar' => ['nullable', 'file', 'mimes:jpeg,png,webp', 'max:2048'],
            'remove_avatar' => ['nullable', 'boolean'],
        ];
    }
}
