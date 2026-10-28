<?php

namespace App\Http\Controllers\Api\JobSeeker;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobSeeker\Dashboard\DashboardResource;
use App\Http\Response\ApiResponse;
use App\Models\JobSeeker;
use App\Services\JobSeeker\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboardService) {}

    public function index(): JsonResponse
    {
        /** @var JobSeeker $jobSeeker */
        $jobSeeker = Auth::guard('job_seekers')->user();

        return ApiResponse::success(new DashboardResource(
            $this->dashboardService->fetchDashboardData($jobSeeker),
        ));
    }
}
