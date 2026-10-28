<?php

namespace App\Http\Controllers\Api\Company;

use App\Http\Controllers\Controller;
use App\Http\Resources\Company\Dashboard\DashboardResource;
use App\Http\Response\ApiResponse;
use App\Models\Staff;
use App\Services\Company\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboardService) {}

    public function index(): JsonResponse
    {
        /** @var Staff $staff */
        $staff = Auth::guard('staffs')->user();

        return ApiResponse::success(new DashboardResource(
            $this->dashboardService->fetchDashboardData($staff),
        ));
    }
}
