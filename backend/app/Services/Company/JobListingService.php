<?php

namespace App\Services\Company;

use App\Enums\JobListingPriorityEnum;
use App\Enums\JobListingStatusEnum;
use App\Exceptions\ConflictException;
use App\Exceptions\ForbiddenException;
use App\Exceptions\ValidationException;
use App\Models\JobListing;
use App\Models\Staff;
use App\Repositories\JobListingRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class JobListingService
{
    public function __construct(private readonly JobListingRepository $jobListings) {}

    public function list(array $filters): LengthAwarePaginator
    {
        return $this->jobListings->searchForCompany($this->staff()->company_id, $filters);
    }

    public function show(string $id): JobListing
    {
        return $this->jobListings->findForCompany($this->staff()->company_id, $id);
    }

    public function create(array $attributes): JobListing
    {
        $staff = $this->staff();
        $attributes = $this->applyPublication($attributes, null);

        $attributes['company_id'] = $staff->company_id;
        $attributes['slug'] = $this->slug($attributes['title']);
        $attributes['created_by'] = $staff->user_id;
        $attributes['priority_status'] = $attributes['priority_status'] ?? JobListingPriorityEnum::NORMAL->value;
        $attributes['is_internal_application'] = $attributes['is_internal_application'] ?? true;

        return DB::transaction(fn () => $this->jobListings->createForCompany(
            Arr::except($attributes, $this->relationKeys()),
            Arr::only($attributes, $this->relationKeys()),
        ));
    }

    public function update(string $id, array $attributes): JobListing
    {
        $staff = $this->staff();
        $jobListing = $this->jobListings->findForCompany($staff->company_id, $id);
        $this->assertCurrent($jobListing, $attributes['updated_at']);

        if ($this->isClosePayload($attributes)) {
            if ($jobListing->job_listings_status === JobListingStatusEnum::CLOSED || $jobListing->isExpired()) {
                throw new ValidationException('This job listing is closed and can no longer be edited.');
            }

            return DB::transaction(fn () => $this->jobListings->closeListing($jobListing, $staff->user_id));
        }

        $this->assertEditable($jobListing, $attributes);

        $attributes = $this->applyPublication($attributes, $jobListing);
        if (($attributes['title'] ?? null) !== $jobListing->title) {
            $attributes['slug'] = $this->slug($attributes['title'], $jobListing->id);
        }
        $attributes['updated_by'] = $staff->user_id;

        return DB::transaction(fn () => $this->jobListings->updateListing(
            $jobListing,
            Arr::except($attributes, [...$this->relationKeys(), 'updated_at']),
            Arr::only($attributes, $this->relationKeys()),
        ));
    }

    public function delete(string $id): void
    {
        $staff = $this->staff();
        $jobListing = $this->jobListings->findForCompany($staff->company_id, $id);
        $jobListing->deleted_by = $staff->user_id;
        $jobListing->save();
        $jobListing->delete();
    }

    private function staff(): Staff
    {
        /** @var Staff $staff */
        $staff = Auth::guard('staffs')->user();

        if (! $staff->company_id) {
            throw new ForbiddenException('You are not assigned to a company.');
        }

        return $staff;
    }

    private function assertCurrent(JobListing $jobListing, string $updatedAt): void
    {
        if (
            ! $jobListing->updated_at
            || Carbon::parse($updatedAt)->getTimestamp() !== $jobListing->updated_at->getTimestamp()
        ) {
            throw new ConflictException('This job listing has changed. Refresh and try again.');
        }
    }

    private function assertEditable(JobListing $jobListing, array $attributes): void
    {
        if ($jobListing->job_listings_status === JobListingStatusEnum::CLOSED || $jobListing->isExpired()) {
            throw new ValidationException('This job listing is closed and can no longer be edited.');
        }

        if (! $this->onlyClose($jobListing)) {
            return;
        }

        $requested = (int) $attributes['job_listings_status'];
        $extra = array_diff(array_keys($attributes), ['job_listings_status', 'updated_at']);
        if ($requested !== JobListingStatusEnum::CLOSED->value || $extra !== []) {
            throw new ValidationException('This job listing has applications. You can only close it.');
        }
    }

    private function isClosePayload(array $attributes): bool
    {
        return (int) $attributes['job_listings_status'] === JobListingStatusEnum::CLOSED->value
            && array_diff(array_keys($attributes), ['job_listings_status', 'updated_at']) === [];
    }

    private function onlyClose(JobListing $jobListing): bool
    {
        return $jobListing->job_listings_status === JobListingStatusEnum::PUBLISHED && $jobListing->hasApplications();
    }

    private function applyPublication(array $attributes, ?JobListing $current): array
    {
        $status = (int) $attributes['job_listings_status'];
        $publishedAt = $this->publishedAt($attributes, $current);

        if ($status === JobListingStatusEnum::PUBLISHED->value && $publishedAt === null) {
            $publishedAt = now();
        }

        if ($status !== JobListingStatusEnum::CLOSED->value && $publishedAt !== null && $publishedAt->lte(now())) {
            $status = JobListingStatusEnum::PUBLISHED->value;
        }

        if ($status === JobListingStatusEnum::DRAFT->value && ! array_key_exists('published_at', $attributes)) {
            $publishedAt = null;
        }

        $attributes['job_listings_status'] = $status;
        $attributes['published_at'] = $publishedAt;

        return $attributes;
    }

    private function publishedAt(array $attributes, ?JobListing $current): ?Carbon
    {
        if (array_key_exists('published_at', $attributes)) {
            return $attributes['published_at'] ? Carbon::parse($attributes['published_at']) : null;
        }

        return $current?->published_at;
    }

    private function slug(string $title, ?string $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'job';
        $slug = $base;
        $suffix = 2;

        while ($this->jobListings->slugExists($slug, $ignoreId)) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    private function relationKeys(): array
    {
        return ['industry_ids', 'category_ids', 'type_ids', 'education_level_ids', 'skills'];
    }
}
