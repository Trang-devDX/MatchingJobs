<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\Staff\StaffIndexRequest;
use App\Http\Requests\Api\Admin\Staff\StaffStoreRequest;
use App\Http\Requests\Api\Admin\Staff\StaffUpdateRequest;
use App\Http\Resources\Admin\Staff\StaffResource;
use App\Http\Response\ApiResponse;
use App\Services\Admin\StaffService;
use Illuminate\Http\JsonResponse;

class StaffController extends Controller
{
    public function __construct(private readonly StaffService $staffService) {}

    public function index(StaffIndexRequest $request, string $companyId): JsonResponse
    {
        $staffs = $this->staffService->fetchStaffList($companyId, $request->validated());

        return ApiResponse::paginated(
            StaffResource::collection($staffs->items())->resolve($request),
            $staffs,
        );
    }

    public function store(StaffStoreRequest $request, string $companyId): JsonResponse
    {
        return ApiResponse::created(
            new StaffResource($this->staffService->createStaff($companyId, $request->validated())),
            'Staff created successfully.',
        );
    }

    public function show(string $companyId, string $staffId): JsonResponse
    {
        return ApiResponse::success(new StaffResource($this->staffService->fetchStaff($companyId, $staffId)));
    }

    public function update(StaffUpdateRequest $request, string $companyId, string $staffId): JsonResponse
    {
        return ApiResponse::success(
            new StaffResource($this->staffService->updateStaff($companyId, $staffId, $request->validated())),
            'Staff updated successfully.',
        );
    }

    public function destroy(string $companyId, string $staffId): JsonResponse
    {
        $this->staffService->deleteStaff($companyId, $staffId);

        return ApiResponse::success(null, 'Staff deleted successfully.');
    }
}
