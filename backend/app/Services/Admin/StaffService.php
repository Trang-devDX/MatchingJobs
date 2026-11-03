<?php

namespace App\Services\Admin;

use App\Enums\UploadedFileTypeEnum;
use App\Models\Staff;
use App\Repositories\CompanyRepository;
use App\Repositories\StaffRepository;
use App\Repositories\UserRepository;
use App\Services\Files\FileStore;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class StaffService
{
    public function __construct(
        private readonly CompanyRepository $companyRepository,
        private readonly StaffRepository $staffRepository,
        private readonly UserRepository $userRepository,
        private readonly FileStore $files,
    ) {}

    public function fetchStaffList(string $companyId, array $filters): LengthAwarePaginator
    {
        $this->companyRepository->findCompany($companyId);

        return $this->staffRepository->searchByCompany($companyId, $filters);
    }

    public function fetchStaff(string $companyId, string $staffId): Staff
    {
        $this->companyRepository->findCompany($companyId);

        return $this->staffRepository->findForCompany($companyId, $staffId);
    }

    public function createStaff(string $companyId, array $attributes): Staff
    {
        $company = $this->companyRepository->findCompany($companyId);
        $avatar = $this->file($attributes, 'avatar');
        $payload = $this->fields($attributes, requirePassword: true);
        $payload['company_id'] = $company->id;
        $payload['email_verified_at'] = now();
        $payload['is_root'] = $company->staffs()->doesntExist() || (bool) Arr::get($attributes, 'is_root');

        return $this->files->apply(null, $avatar, false, "avatars/staffs/{$company->id}", UploadedFileTypeEnum::AVATAR, $this->actorId(), function (?string $path) use ($payload) {
            $payload['avatar_url'] = $path;

            return $this->userRepository->insertStaff($payload, $this->actorId());
        });
    }

    public function updateStaff(string $companyId, string $staffId, array $attributes): Staff
    {
        $staff = $this->fetchStaff($companyId, $staffId);
        $avatar = $this->file($attributes, 'avatar');
        $payload = $this->fields($attributes, requirePassword: false);
        $payload['updated_by'] = $this->actorId();
        $payload['is_root'] = (bool) Arr::get($attributes, 'is_root');

        if (empty($payload['password'])) {
            unset($payload['password']);
        }

        return $this->files->apply(
            $staff->avatar_url,
            $avatar,
            (bool) Arr::get($attributes, 'remove_avatar'),
            "avatars/staffs/{$companyId}",
            UploadedFileTypeEnum::AVATAR,
            $this->actorId(),
            function (?string $path) use ($staff, $payload) {
                $payload['avatar_url'] = $path;

                /** @var Staff $updated */
                $updated = $this->staffRepository->update($staff->id, $payload);

                return $updated;
            },
        );
    }

    public function deleteStaff(string $companyId, string $staffId): void
    {
        $staff = $this->fetchStaff($companyId, $staffId);
        $actorId = $this->actorId();

        DB::transaction(function () use ($staff, $actorId): void {
            $this->files->discard($staff->avatar_url, $actorId);
            $staff->deleted_by = $actorId;
            $staff->save();
            $staff->delete();
        });
    }

    private function fields(array $attributes, bool $requirePassword): array
    {
        $fields = Arr::only($attributes, [
            'first_name',
            'middle_name',
            'last_name',
            'email',
            'password',
            'phone_number',
            'position',
            'status',
        ]);
        $fields['name'] = trim(implode(' ', array_filter(Arr::only($fields, ['first_name', 'middle_name', 'last_name']))));

        if (! $requirePassword && empty($fields['password'])) {
            unset($fields['password']);
        }

        return $fields;
    }

    private function file(array $attributes, string $key): ?UploadedFile
    {
        $file = Arr::get($attributes, $key);

        return $file instanceof UploadedFile ? $file : null;
    }

    private function actorId(): ?string
    {
        return auth('administrators')->user()?->user_id;
    }
}
