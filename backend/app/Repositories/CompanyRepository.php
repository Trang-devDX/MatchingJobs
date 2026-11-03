<?php

namespace App\Repositories;

use App\Exceptions\NotFoundException;
use App\Models\Company;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CompanyRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Company);
    }

    public function searchCompanies(array $filters): LengthAwarePaginator
    {
        $query = $this->model->newQuery()->with('country');

        if ($search = $filters['search'] ?? null) {
            $query->where(function ($query) use ($search): void {
                $this->whereLikeInsensitive($query, 'name', $search);
                $query->orWhere(fn ($query) => $this->whereLikeInsensitive($query, 'email', $search));
            });
        }

        return $query->orderByDesc('created_at')->paginate(min((int) ($filters['per_page'] ?? 15), 100));
    }

    public function findCompany(string $id): Company
    {
        /** @var Company|null $company */
        $company = $this->model->newQuery()->with('country')->find($id);

        if (! $company) {
            throw new NotFoundException('Company not found.');
        }

        return $company;
    }
}
