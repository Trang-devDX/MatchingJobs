<?php

namespace App\Services\Admin;

use App\Enums\UploadedFileTypeEnum;
use App\Models\Company;
use App\Repositories\CompanyRepository;
use App\Services\Files\FileStore;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class CompanyService
{
    public function __construct(
        private readonly CompanyRepository $companyRepository,
        private readonly FileStore $files,
    ) {}

    public function fetchCompanyList(array $filters): LengthAwarePaginator
    {
        return $this->companyRepository->searchCompanies($filters);
    }

    public function fetchCompany(string $id): Company
    {
        return $this->companyRepository->findCompany($id);
    }

    public function createCompany(array $attributes): Company
    {
        $logo = $this->file($attributes, 'logo');
        $payload = $this->fields($attributes);
        $payload['created_by_admin'] = true;
        $payload['created_by'] = $this->actorId();

        return $this->files->apply(null, $logo, false, 'logos/companies', UploadedFileTypeEnum::COMPANY_LOGO, $this->actorId(), function (?string $path) use ($payload) {
            $payload['logo_url'] = $path;

            /** @var Company $company */
            $company = $this->companyRepository->create($payload);

            return $company->load('country');
        });
    }

    public function updateCompany(string $id, array $attributes): Company
    {
        $company = $this->companyRepository->findCompany($id);
        $logo = $this->file($attributes, 'logo');
        $payload = $this->fields($attributes);
        $payload['updated_by'] = $this->actorId();

        return $this->files->apply(
            $company->logo_url,
            $logo,
            (bool) Arr::get($attributes, 'remove_logo'),
            'logos/companies',
            UploadedFileTypeEnum::COMPANY_LOGO,
            $this->actorId(),
            function (?string $path) use ($company, $payload) {
                $payload['logo_url'] = $path;

                /** @var Company $updated */
                $updated = $this->companyRepository->update($company->id, $payload);

                return $updated->load('country');
            },
        );
    }

    public function deleteCompany(string $id): void
    {
        $company = $this->companyRepository->findCompany($id);
        $actorId = $this->actorId();

        DB::transaction(function () use ($company, $actorId): void {
            foreach ($company->staffs as $staff) {
                $this->files->discard($staff->avatar_url, $actorId);
                $staff->deleted_by = $actorId;
                $staff->save();
                $staff->delete();
            }

            $this->files->discard($company->logo_url, $actorId);

            $company->deleted_by = $actorId;
            $company->save();
            $company->delete();
        });
    }

    private function fields(array $attributes): array
    {
        return Arr::only($attributes, [
            'name',
            'status',
            'email',
            'phone_number',
            'website_url',
            'description',
            'country_id',
            'address',
        ]);
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
