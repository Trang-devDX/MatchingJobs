<?php

namespace App\Http\Controllers\Api\JobSeeker;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\JobSeeker\JobListing\ApplyJobListingRequest;
use App\Http\Requests\Api\JobSeeker\JobListing\JobListingIndexRequest;
use App\Http\Resources\JobSeeker\JobApplication\JobApplicationResource;
use App\Http\Resources\JobSeeker\JobListing\JobListingListResource;
use App\Http\Resources\JobSeeker\JobListing\JobListingResource;
use App\Http\Response\ApiResponse;
use App\Services\JobSeeker\JobApplicationService;
use Illuminate\Http\JsonResponse;

class JobListingController extends Controller
{
    public function __construct(private readonly JobApplicationService $applications) {}

    public function index(JobListingIndexRequest $request): JsonResponse
    {
        $jobs = $this->applications->listJobs($request->validated());

        return ApiResponse::paginated(
            JobListingListResource::collection($jobs->items())->resolve($request),
            $jobs,
        );
    }

    public function show(string $id): JsonResponse
    {
        return ApiResponse::success(new JobListingResource($this->applications->showJob($id)));
    }

    public function apply(ApplyJobListingRequest $request, string $id): JsonResponse
    {
        return ApiResponse::created(
            new JobApplicationResource($this->applications->apply($id, $request->validated())),
            'Application submitted successfully.',
        );
    }
}
