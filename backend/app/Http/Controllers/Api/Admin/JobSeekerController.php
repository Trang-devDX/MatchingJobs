<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\JobSeeker\JobSeekerIndexRequest;
use App\Http\Requests\Api\Admin\JobSeeker\JobSeekerStoreRequest;
use App\Http\Requests\Api\Admin\JobSeeker\JobSeekerUpdateRequest;
use App\Http\Resources\Admin\JobSeeker\JobSeekerResource;
use App\Http\Response\ApiResponse;
use App\Services\Admin\JobSeekerService;
use Illuminate\Http\JsonResponse;

class JobSeekerController extends Controller
{
    public function __construct(private readonly JobSeekerService $jobSeekerService) {}

    public function index(JobSeekerIndexRequest $request): JsonResponse
    {
        $jobSeekers = $this->jobSeekerService->fetchJobSeekerList($request->validated());

        return ApiResponse::paginated(
            JobSeekerResource::collection($jobSeekers->items())->resolve($request),
            $jobSeekers,
        );
    }

    public function store(JobSeekerStoreRequest $request): JsonResponse
    {
        return ApiResponse::created(
            new JobSeekerResource($this->jobSeekerService->createJobSeeker($request->validated())),
            'Jobseeker created successfully.',
        );
    }

    public function show(string $id): JsonResponse
    {
        return ApiResponse::success(new JobSeekerResource($this->jobSeekerService->fetchJobSeeker($id)));
    }

    public function update(JobSeekerUpdateRequest $request, string $id): JsonResponse
    {
        return ApiResponse::success(
            new JobSeekerResource($this->jobSeekerService->updateJobSeeker($id, $request->validated())),
            'Jobseeker updated successfully.',
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $this->jobSeekerService->deleteJobSeeker($id);

        return ApiResponse::success(null, 'Jobseeker deleted successfully.');
    }
}
