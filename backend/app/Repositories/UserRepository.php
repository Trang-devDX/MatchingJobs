<?php

namespace App\Repositories;

use App\Enums\UserTypeEnum;
use App\Models\JobSeeker;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new User());
    }

    public function insertJobSeeker(array $attributes, string $createdBy): JobSeeker
    {
        $user = $this->model->create([
            'type' => UserTypeEnum::JOB_SEEKER->value,
            'created_by' => $createdBy,
        ]);

        return $user->jobSeeker()->create($attributes);
    }

    public function insertStaff(array $attributes, ?string $createdBy): Staff
    {
        return DB::transaction(function () use ($attributes, $createdBy) {
            $user = $this->model->create([
                'type' => UserTypeEnum::STAFF->value,
                'created_by' => $createdBy,
            ]);

            $attributes['user_id'] = $user->id;
            $attributes['created_by'] = $createdBy;

            return $user->staff()->create($attributes);
        });
    }
}
