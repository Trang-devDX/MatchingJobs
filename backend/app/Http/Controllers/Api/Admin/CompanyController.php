<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\Company\CompanyIndexRequest;
use App\Http\Requests\Api\Admin\Company\CompanyStoreRequest;
use App\Http\Requests\Api\Admin\Company\CompanyUpdateRequest;
use App\Http\Resources\Admin\Company\CompanyResource;
use App\Http\Response\ApiResponse;
use App\Services\Admin\CompanyService;
use Illuminate\Http\JsonResponse;

class CompanyController extends Controller
{
    public function __construct(private readonly CompanyService $companyService) {}

    public function index(CompanyIndexRequest $request): JsonResponse
    {
        $companies = $this->companyService->fetchCompanyList($request->validated());

        return ApiResponse::paginated(
            CompanyResource::collection($companies->items())->resolve($request),
            $companies,
        );
    }

    public function store(CompanyStoreRequest $request): JsonResponse
    {
        return ApiResponse::created(
            new CompanyResource($this->companyService->createCompany($request->validated())),
            'Company created successfully.',
        );
    }

    public function show(string $id): JsonResponse
    {
        return ApiResponse::success(new CompanyResource($this->companyService->fetchCompany($id)));
    }

    public function update(CompanyUpdateRequest $request, string $id): JsonResponse
    {
        return ApiResponse::success(
            new CompanyResource($this->companyService->updateCompany($id, $request->validated())),
            'Company updated successfully.',
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $this->companyService->deleteCompany($id);

        return ApiResponse::success(null, 'Company deleted successfully.');
    }
}
