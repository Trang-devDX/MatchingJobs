<?php

namespace App\Repositories;

use App\Models\JobSeeker;
use Illuminate\Pagination\LengthAwarePaginator;

class JobSeekerRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new JobSeeker());
    }

    public function searchJobSeekers(array $filters): LengthAwarePaginator
    {
        return $this->model->newQuery()
            ->when($filters['search'] ?? null, function ($query, $search): void {
                $query->where(fn ($query) => $query
                    ->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%"));
            })
            ->orderByDesc('created_at')
            ->paginate(min((int) ($filters['per_page'] ?? 15), 100));
    }

    public function countJobSeekers(array $criteria = []): int
    {
        $query = $this->model->newQuery();

        if ($criteria !== []) {
            $query->where($criteria);
        }

        return $query->count();
    }

    public function findJobSeeker(string $id): JobSeeker
    {
        return $this->model->newQuery()->findOrFail($id);
    }

    public function updateJobSeeker(JobSeeker $jobSeeker, array $attributes): JobSeeker
    {
        $jobSeeker->update($attributes);

        return $jobSeeker->refresh();
    }

    public function deleteJobSeeker(string $id, string $administratorId): void
    {
        $jobSeeker = $this->findJobSeeker($id);
        $user = $jobSeeker->user;
        $jobSeeker->update(['deleted_by' => $administratorId]);
        $user->update(['deleted_by' => $administratorId]);
        $user->delete();
        $jobSeeker->delete();
    }
}
