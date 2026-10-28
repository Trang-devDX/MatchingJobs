<?php

namespace App\Services\Admin;

use App\Enums\CommonStatusEnum;
use App\Repositories\DashboardRepository;
use App\Repositories\JobSeekerRepository;

class DashboardService
{
    public function __construct(
        private readonly DashboardRepository $dashboardRepository,
        private readonly JobSeekerRepository $jobSeekerRepository,
    ) {}

    public function fetchDashboardData(): object
    {
        return (object) [
            'total_job_seekers' => $this->jobSeekerRepository->countJobSeekers(),
            'active_job_seekers' => $this->jobSeekerRepository->countJobSeekers(['status' => CommonStatusEnum::ACTIVE->value]),
            ...$this->dashboardRepository->getCompanyAndJobStatistics(),
        ];
    }
}
