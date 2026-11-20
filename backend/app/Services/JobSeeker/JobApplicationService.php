<?php

namespace App\Services\JobSeeker;

use App\Exceptions\BusinessException;
use App\Exceptions\NotFoundException;
use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\JobSeeker;
use App\Enums\JobApplicationStatusEnum;
use App\Enums\JobListingStatusEnum;
use App\Services\JobApplicationNotifier;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class JobApplicationService
{
    public function __construct(private readonly JobApplicationNotifier $notifier) {}

    public function listJobs(array $filters): LengthAwarePaginator
    {
        $seeker = $this->seeker();

        return JobListing::query()
            ->with('company:id,name')
            ->withExists(['jobApplications as applied' => fn ($query) => $query->where('user_id', $seeker->user_id)])
            ->where('job_listings_status', JobListingStatusEnum::PUBLISHED->value)
            ->where(function ($query) {
                $query->whereNull('expired_at')->orWhere('expired_at', '>', now());
            })
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->whereRaw(
                'LOWER(title) LIKE ?',
                ['%'.mb_strtolower($search).'%'],
            ))
            ->latest('published_at')
            ->latest('created_at')
            ->paginate(15);
    }

    public function showJob(string $id): JobListing
    {
        $seeker = $this->seeker();
        $job = JobListing::query()
            ->with(['company:id,name', 'country', 'island', 'town'])
            ->where('job_listings_status', JobListingStatusEnum::PUBLISHED->value)
            ->where(function ($query) {
                $query->whereNull('expired_at')->orWhere('expired_at', '>', now());
            })
            ->find($id);

        if (! $job) {
            throw new NotFoundException('This job is not available.');
        }

        $application = $job->jobApplications()->where('user_id', $seeker->user_id)->first();
        if ($application) {
            $job->setRelation('currentApplication', $application);
        }

        return $job;
    }

    public function apply(string $jobId, array $data): JobApplication
    {
        $seeker = $this->seeker();

        $application = DB::transaction(function () use ($jobId, $data, $seeker) {
            $job = JobListing::query()->lockForUpdate()->find($jobId);
            if (! $job || $job->job_listings_status !== JobListingStatusEnum::PUBLISHED || $job->isExpired()) {
                throw new NotFoundException('This job is not available.');
            }
            if (! $job->is_internal_application) {
                throw new BusinessException('This job accepts applications on an external site.');
            }

            $existing = JobApplication::query()
                ->where('job_listing_id', $job->id)
                ->where('user_id', $seeker->user_id)
                ->first();
            if ($existing) {
                throw new BusinessException('You have already applied to this job.');
            }

            return JobApplication::query()->create([
                'user_id' => $seeker->user_id,
                'job_listing_id' => $job->id,
                'job_application_status' => JobApplicationStatusEnum::PENDING,
                'cover_letter' => $data['cover_letter'] ?? null,
                'is_viewed' => false,
                'applied_at' => now(),
            ]);
        });

        $this->notifier->applied($application);

        return $application->load(['jobListing.company', 'jobSeeker']);
    }

    public function listApplications(): LengthAwarePaginator
    {
        return JobApplication::query()
            ->with(['jobListing.company:id,name'])
            ->where('user_id', $this->seeker()->user_id)
            ->latest('applied_at')
            ->paginate(15);
    }

    public function showApplication(string $id): JobApplication
    {
        $application = JobApplication::query()
            ->with(['jobListing.company:id,name'])
            ->where('user_id', $this->seeker()->user_id)
            ->find($id);

        if (! $application) {
            throw new NotFoundException('Application not found.');
        }

        return $application;
    }

    private function seeker(): JobSeeker
    {
        /** @var JobSeeker $seeker */
        $seeker = Auth::guard('job_seekers')->user();

        return $seeker;
    }
}
