<?php

namespace App\Repositories;

use App\Enums\JobListingStatusEnum;
use App\Exceptions\NotFoundException;
use App\Models\JobListing;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class JobListingRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new JobListing);
    }

    public function searchForCompany(string $companyId, array $filters): LengthAwarePaginator
    {
        $query = $this->scoped($companyId)->with(['jobTypes']);

        if ($search = $filters['search'] ?? null) {
            $this->whereLikeInsensitive($query, 'title', $search);
        }

        if ($typeId = $filters['type_id'] ?? null) {
            $query->whereHas('jobTypes', fn ($query) => $query->where('job_types.id', $typeId));
        }

        if ($from = $filters['date_from'] ?? null) {
            $query->where('created_at', '>=', $from);
        }

        if ($to = $filters['date_end'] ?? null) {
            $query->where('created_at', '<=', $to);
        }

        $status = isset($filters['job_listings_status']) ? (int) $filters['job_listings_status'] : null;
        if ($status === JobListingStatusEnum::PUBLISHED->value) {
            $query->where('job_listings_status', JobListingStatusEnum::PUBLISHED->value)
                ->where(fn ($query) => $query->whereNull('expired_at')->orWhere('expired_at', '>', now()));
        } elseif ($status === JobListingStatusEnum::DRAFT->value) {
            $query->where('job_listings_status', JobListingStatusEnum::DRAFT->value)
                ->where(fn ($query) => $query->whereNull('expired_at')->orWhere('expired_at', '>', now()));
        } elseif ($status === JobListingStatusEnum::CLOSED->value) {
            $query->where(function ($query): void {
                $query->where('job_listings_status', JobListingStatusEnum::CLOSED->value)
                    ->orWhere(fn ($query) => $query->whereNotNull('expired_at')->where('expired_at', '<=', now()));
            });
        }

        return $query->orderByDesc('created_at')->paginate(min((int) ($filters['per_page'] ?? 15), 100));
    }

    public function findForCompany(string $companyId, string $id): JobListing
    {
        $jobListing = $this->scoped($companyId)->with($this->detailRelations())->find($id);

        if (! $jobListing instanceof JobListing) {
            throw new NotFoundException('Job listing not found.');
        }

        return $jobListing;
    }

    public function createForCompany(array $attributes, array $relations): JobListing
    {
        /** @var JobListing $jobListing */
        $jobListing = $this->model->newQuery()->create($attributes);
        $this->syncRelations($jobListing, $relations);

        return $jobListing->load($this->detailRelations());
    }

    public function updateListing(JobListing $jobListing, array $attributes, array $relations): JobListing
    {
        $jobListing->update($attributes);
        $this->syncRelations($jobListing, $relations);

        return $jobListing->refresh()->load($this->detailRelations());
    }

    public function closeListing(JobListing $jobListing, string $actorId): JobListing
    {
        $jobListing->update([
            'job_listings_status' => JobListingStatusEnum::CLOSED->value,
            'updated_by' => $actorId,
        ]);

        return $jobListing->refresh()->load($this->detailRelations());
    }

    public function slugExists(string $slug, ?string $ignoreId = null): bool
    {
        return $this->model->newQuery()
            ->withTrashed()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists();
    }

    private function scoped(string $companyId)
    {
        return $this->model->newQuery()
            ->where('company_id', $companyId)
            ->withExists('jobApplications');
    }

    private function detailRelations(): array
    {
        return [
            'country',
            'island',
            'town',
            'jobIndustries',
            'jobCategories',
            'jobTypes',
            'educationLevels',
            'jobSkills',
        ];
    }

    private function syncRelations(JobListing $jobListing, array $relations): void
    {
        $this->replacePivot('job_listing_industries', 'job_industry_id', $jobListing->id, $relations['industry_ids'] ?? []);
        $this->replacePivot('job_listing_categories', 'job_category_id', $jobListing->id, $relations['category_ids'] ?? []);
        $this->replacePivot('job_listing_types', 'job_type_id', $jobListing->id, $relations['type_ids'] ?? []);
        $this->replacePivot('job_listing_education_levels', 'education_level_id', $jobListing->id, $relations['education_level_ids'] ?? []);

        $jobListing->jobSkills()->delete();
        foreach ($relations['skills'] ?? [] as $name) {
            $jobListing->jobSkills()->create(['name' => $name]);
        }
    }

    private function replacePivot(string $table, string $relatedKey, string $jobListingId, array $ids): void
    {
        DB::table($table)->where('job_listing_id', $jobListingId)->delete();

        $now = now();
        $rows = [];
        foreach (array_values(array_unique($ids)) as $id) {
            $rows[] = [
                'id' => (string) Str::uuid(),
                'job_listing_id' => $jobListingId,
                $relatedKey => $id,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        if ($rows !== []) {
            DB::table($table)->insert($rows);
        }
    }
}
