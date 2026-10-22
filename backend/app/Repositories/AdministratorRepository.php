<?php

namespace App\Repositories;

use App\Exceptions\NotFoundException;
use App\Models\Administrator;
use DateTimeInterface;

class AdministratorRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Administrator);
    }

    public function updateLastLoginAt(int|string $id, DateTimeInterface|string $lastLoginAt): bool
    {
        $administrator = $this->model->find($id);

        if (! $administrator) {
            throw new NotFoundException('Administrator not found.');
        }

        $administrator->timestamps = false;
        $administrator->last_login_at = $lastLoginAt;

        return $administrator->saveQuietly();
    }
}
