<?php

namespace App\Services\JobSeeker;

use App\Models\JobSeeker;
use App\Repositories\DashboardRepository;

class DashboardService
{
    public function __construct(private readonly DashboardRepository $dashboardRepository) {}

    public function fetchDashboardData(JobSeeker $jobSeeker): array
    {
        return $this->dashboardRepository->getJobSeekerDashboardStatistics($jobSeeker->user_id);
    }
}
