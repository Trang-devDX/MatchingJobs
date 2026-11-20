<?php

namespace App\Http\Controllers\Api\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Company\JobApplication\JobApplicationIndexRequest;
use App\Http\Requests\Api\Company\JobApplication\JobApplicationUpdateRequest;
use App\Http\Resources\Company\JobApplication\JobApplicationResource;
use App\Http\Response\ApiResponse;
use App\Services\Company\JobApplicationService;
use Illuminate\Http\JsonResponse;

class JobApplicationController extends Controller
{
    public function __construct(private readonly JobApplicationService $applications) {}

    public function index(JobApplicationIndexRequest $request): JsonResponse
    {
        $applications = $this->applications->list($request->validated());

        return ApiResponse::paginated(
            JobApplicationResource::collection($applications->items())->resolve($request),
            $applications,
        );
    }

    public function show(string $id): JsonResponse
    {
        return ApiResponse::success(new JobApplicationResource($this->applications->show($id)));
    }

    public function update(JobApplicationUpdateRequest $request, string $id): JsonResponse
    {
        return ApiResponse::success(
            new JobApplicationResource($this->applications->updateStatus($id, $request->validated())),
            'Application updated successfully.',
        );
    }
}
