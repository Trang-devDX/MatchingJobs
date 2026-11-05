<?php

namespace App\Http\Controllers\Api\JobSeeker;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobSeeker\JobApplication\JobApplicationResource;
use App\Http\Response\ApiResponse;
use App\Services\JobSeeker\JobApplicationService;
use Illuminate\Http\JsonResponse;

class JobApplicationController extends Controller
{
    public function __construct(private readonly JobApplicationService $applications) {}

    public function index(): JsonResponse
    {
        $applications = $this->applications->listApplications();

        return ApiResponse::paginated(
            JobApplicationResource::collection($applications->items())->resolve(),
            $applications,
        );
    }

    public function show(string $id): JsonResponse
    {
        return ApiResponse::success(new JobApplicationResource($this->applications->showApplication($id)));
    }
}
