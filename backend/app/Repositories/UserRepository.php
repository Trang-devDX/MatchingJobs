<?php

namespace App\Repositories;

use App\Enums\UserTypeEnum;
use App\Models\JobSeeker;
use App\Models\User;

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
}
