<?php

namespace App\Repositories;

use App\Enums\CommonStatusEnum;
use App\Enums\JobListingStatusEnum;
use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    public function getCompanyAndJobStatistics(): array
    {
        return [
            'total_companies' => DB::table('companies')->whereNull('deleted_at')->count(),
            'total_jobs' => DB::table('job_listings')->whereNull('deleted_at')->count(),
            'active_jobs' => DB::table('job_listings')
                ->join('companies', 'companies.id', '=', 'job_listings.company_id')
                ->whereNull('job_listings.deleted_at')
                ->whereNull('companies.deleted_at')
                ->where('companies.status', CommonStatusEnum::ACTIVE->value)
                ->where('job_listings.job_listings_status', JobListingStatusEnum::PUBLISHED->value)
                ->where(fn ($query) => $query->whereNull('job_listings.expired_at')->orWhere('job_listings.expired_at', '>', now()))
                ->count(),
        ];
    }

    public function getCompanyDashboardStatistics(string $companyId): array
    {
        $jobs = DB::table('job_listings')
            ->where('company_id', $companyId)
            ->whereNull('deleted_at');

        $applications = DB::table('job_applications')
            ->join('job_listings', 'job_listings.id', '=', 'job_applications.job_listing_id')
            ->where('job_listings.company_id', $companyId)
            ->whereNull('job_listings.deleted_at')
            ->whereNull('job_applications.deleted_at');

        return [
            'total_jobs' => (clone $jobs)->count(),
            'published_jobs' => (clone $jobs)
                ->where('job_listings_status', JobListingStatusEnum::PUBLISHED->value)
                ->where(fn ($query) => $query->whereNull('expired_at')->orWhere('expired_at', '>', now()))
                ->count(),
            'total_applications' => (clone $applications)->count(),
            'pending_applications' => (clone $applications)->where('job_application_status', 1)->count(),
        ];
    }

    public function getJobSeekerDashboardStatistics(string $userId): array
    {
        $applications = DB::table('job_applications')
            ->where('user_id', $userId)
            ->whereNull('deleted_at');

        return [
            'total_applications' => (clone $applications)->count(),
            'pending_applications' => (clone $applications)->where('job_application_status', 1)->count(),
            'saved_jobs' => DB::table('job_follows')
                ->join('job_listings', 'job_listings.id', '=', 'job_follows.job_listing_id')
                ->where('job_follows.user_id', $userId)
                ->whereNull('job_follows.deleted_at')
                ->whereNull('job_listings.deleted_at')
                ->count(),
            'followed_companies' => DB::table('company_follows')
                ->join('companies', 'companies.id', '=', 'company_follows.company_id')
                ->where('company_follows.user_id', $userId)
                ->whereNull('company_follows.deleted_at')
                ->whereNull('companies.deleted_at')
                ->count(),
        ];
    }
}
