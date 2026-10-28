<?php

namespace App\Services\Company;

use App\Models\Staff;
use App\Repositories\DashboardRepository;

class DashboardService
{
    public function __construct(private readonly DashboardRepository $dashboardRepository) {}

    public function fetchDashboardData(Staff $staff): array
    {
        return $this->dashboardRepository->getCompanyDashboardStatistics($staff->company_id);
    }
}
