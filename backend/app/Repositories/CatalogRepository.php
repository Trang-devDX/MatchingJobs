<?php

namespace App\Repositories;

use App\Models\EducationLevel;
use App\Models\Island;
use App\Models\JobCategory;
use App\Models\JobIndustry;
use App\Models\JobType;
use App\Models\Town;
use Illuminate\Database\Eloquent\Collection;

class CatalogRepository
{
    public function industries(): Collection
    {
        return JobIndustry::query()->orderBy('sort')->orderBy('name')->get(['id', 'name']);
    }

    public function categories(): Collection
    {
        return JobCategory::query()->orderBy('sort')->orderBy('name')->get(['id', 'name']);
    }

    public function types(): Collection
    {
        return JobType::query()->orderBy('sort')->orderBy('name')->get(['id', 'name']);
    }

    public function educationLevels(): Collection
    {
        return EducationLevel::query()->orderBy('sort')->orderBy('name')->get(['id', 'name']);
    }

    public function islands(string $countryId): Collection
    {
        return Island::query()
            ->where('country_id', $countryId)
            ->orderBy('sort')
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    public function towns(string $islandId): Collection
    {
        return Town::query()
            ->where('island_id', $islandId)
            ->orderBy('sort')
            ->orderBy('name')
            ->get(['id', 'name']);
    }
}
