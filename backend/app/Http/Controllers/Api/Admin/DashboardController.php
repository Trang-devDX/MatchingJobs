<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Dashboard\DashboardResource;
use App\Http\Response\ApiResponse;
use App\Services\Admin\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboardService) {}

    public function index(): JsonResponse
    {
        return ApiResponse::success(new DashboardResource($this->dashboardService->fetchDashboardData()));
    }
}
