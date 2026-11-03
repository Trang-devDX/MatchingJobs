<?php

namespace App\Repositories;

use App\Exceptions\NotFoundException;
use App\Models\Staff;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StaffRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Staff);
    }

    public function searchByCompany(string $companyId, array $filters): LengthAwarePaginator
    {
        $query = $this->model->newQuery()->where('company_id', $companyId);

        if ($search = $filters['search'] ?? null) {
            $query->where(function ($query) use ($search): void {
                $this->whereLikeInsensitive($query, 'name', $search);
                $query->orWhere(fn ($query) => $this->whereLikeInsensitive($query, 'email', $search));
            });
        }

        return $query->orderByDesc('created_at')->paginate(min((int) ($filters['per_page'] ?? 15), 100));
    }

    public function findForCompany(string $companyId, string $staffId): Staff
    {
        /** @var Staff|null $staff */
        $staff = $this->model->newQuery()
            ->where('company_id', $companyId)
            ->find($staffId);

        if (! $staff) {
            throw new NotFoundException('Staff not found.');
        }

        return $staff;
    }
}
