<?php

namespace App\Services\Admin;

use App\Enums\CommonStatusEnum;
use App\Models\JobSeeker;
use App\Repositories\JobSeekerRepository;
use App\Repositories\UserRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class JobSeekerService
{
    public function __construct(
        private readonly JobSeekerRepository $jobSeekerRepository,
        private readonly UserRepository $userRepository,
    ) {}

    public function fetchJobSeekerList(array $filters): LengthAwarePaginator
    {
        return $this->jobSeekerRepository->searchJobSeekers($filters);
    }

    public function fetchJobSeeker(string $id): JobSeeker
    {
        return $this->jobSeekerRepository->findJobSeeker($id);
    }

    public function createJobSeeker(array $attributes): JobSeeker
    {
        $administratorId = auth('administrators')->user()->user_id;
        $attributes['status'] = CommonStatusEnum::ACTIVE->value;
        $attributes['name'] = $this->name($attributes);
        $attributes['email_verified_at'] = now();
        $attributes['created_by'] = $administratorId;
        return DB::transaction(fn () => $this->userRepository->insertJobSeeker($attributes, $administratorId));
    }

    public function updateJobSeeker(string $id, array $attributes): JobSeeker
    {
        $jobSeeker = $this->jobSeekerRepository->findJobSeeker($id);
        if (empty($attributes['password'])) {
            unset($attributes['password']);
        }
        $attributes['name'] = $this->name(array_merge($jobSeeker->toArray(), $attributes));
        $attributes['updated_by'] = auth('administrators')->user()->user_id;

        return $this->jobSeekerRepository->updateJobSeeker($jobSeeker, $attributes);
    }

    public function deleteJobSeeker(string $id): void
    {
        $administratorId = auth('administrators')->user()->user_id;
        DB::transaction(fn () => $this->jobSeekerRepository->deleteJobSeeker($id, $administratorId));
    }

    private function name(array $attributes): string
    {
        return trim(implode(' ', array_filter(Arr::only($attributes, ['first_name', 'middle_name', 'last_name']))));
    }
}
