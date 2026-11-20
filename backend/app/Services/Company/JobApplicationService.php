<?php

namespace App\Services\Company;

use App\Enums\JobApplicationStatusEnum;
use App\Exceptions\NotFoundException;
use App\Exceptions\ConflictException;
use App\Models\JobApplication;
use App\Models\Staff;
use App\Services\JobApplicationNotifier;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class JobApplicationService
{
    public function __construct(private readonly JobApplicationNotifier $notifier) {}

    public function list(array $filters): LengthAwarePaginator
    {
        return $this->scoped()
            ->with(['jobListing:id,title,company_id', 'jobSeeker:id,user_id,name,email'])
            ->when($filters['job_listing_id'] ?? null, fn ($query, $jobId) => $query->where('job_listing_id', $jobId))
            ->when($filters['job_application_status'] ?? null, fn ($query, $status) => $query->where('job_application_status', $status))
            ->latest('applied_at')
            ->paginate(15);
    }

    public function show(string $id): JobApplication
    {
        $application = $this->scoped()
            ->with(['jobListing:id,title,company_id', 'jobSeeker:id,user_id,name,email'])
            ->find($id);

        if (! $application) {
            throw new NotFoundException('Application not found.');
        }

        if (! $application->is_viewed) {
            JobApplication::query()->whereKey($application->id)->update(['is_viewed' => true]);
            $application->is_viewed = true;
        }

        return $application;
    }

    public function updateStatus(string $id, array $data): JobApplication
    {
        $application = $this->scoped()->with(['jobListing.company', 'jobSeeker'])->find($id);
        if (! $application) {
            throw new NotFoundException('Application not found.');
        }

        if (
            ! $application->updated_at
            || Carbon::parse($data['updated_at'])->getTimestamp() !== $application->updated_at->getTimestamp()
        ) {
            throw new ConflictException('This application has changed. Refresh and try again.');
        }

        $next = JobApplicationStatusEnum::from((int) $data['job_application_status']);
        if ($application->job_application_status === $next) {
            return $application;
        }

        $application->forceFill([
            'job_application_status' => $next,
            'is_viewed' => true,
        ])->save();

        $this->notifier->statusChanged($application->refresh());

        return $application->load(['jobListing.company', 'jobSeeker']);
    }

    private function scoped()
    {
        return JobApplication::query()->whereHas(
            'jobListing',
            fn ($query) => $query->where('company_id', $this->staff()->company_id),
        );
    }

    private function staff(): Staff
    {
        /** @var Staff $staff */
        $staff = Auth::guard('staffs')->user();

        return $staff;
    }
}
