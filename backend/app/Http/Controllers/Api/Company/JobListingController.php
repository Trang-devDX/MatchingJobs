<?php

namespace App\Http\Controllers\Api\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Company\JobListing\JobListingIndexRequest;
use App\Http\Requests\Api\Company\JobListing\JobListingStoreRequest;
use App\Http\Requests\Api\Company\JobListing\JobListingUpdateRequest;
use App\Http\Resources\Company\JobListing\JobListingListResource;
use App\Http\Resources\Company\JobListing\JobListingResource;
use App\Http\Response\ApiResponse;
use App\Services\Company\JobListingService;
use Illuminate\Http\JsonResponse;

class JobListingController extends Controller
{
    public function __construct(private readonly JobListingService $jobListings) {}

    public function index(JobListingIndexRequest $request): JsonResponse
    {
        $jobs = $this->jobListings->list($request->validated());

        return ApiResponse::paginated(
            JobListingListResource::collection($jobs->items())->resolve($request),
            $jobs,
        );
    }

    public function store(JobListingStoreRequest $request): JsonResponse
    {
        return ApiResponse::created(
            new JobListingResource($this->jobListings->create($request->validated())),
            'Job listing created successfully.',
        );
    }

    public function show(string $id): JsonResponse
    {
        return ApiResponse::success(new JobListingResource($this->jobListings->show($id)));
    }

    public function update(JobListingUpdateRequest $request, string $id): JsonResponse
    {
        return ApiResponse::success(
            new JobListingResource($this->jobListings->update($id, $request->validated())),
            'Job listing updated successfully.',
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $this->jobListings->delete($id);

        return ApiResponse::success(null, 'Job listing deleted successfully.');
    }
}
