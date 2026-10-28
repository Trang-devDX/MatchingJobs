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
}
