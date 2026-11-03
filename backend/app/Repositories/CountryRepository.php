<?php

namespace App\Repositories;

use App\Models\Country;
use Illuminate\Database\Eloquent\Collection;

class CountryRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Country);
    }

    public function listCountries(): Collection
    {
        return $this->model->newQuery()->orderBy('name')->get(['id', 'name']);
    }
}
