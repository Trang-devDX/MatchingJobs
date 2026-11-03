<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Country\CountryResource;
use App\Http\Response\ApiResponse;
use App\Repositories\CountryRepository;
use Illuminate\Http\JsonResponse;

class CountryController extends Controller
{
    public function __construct(private readonly CountryRepository $countryRepository) {}

    public function index(): JsonResponse
    {
        return ApiResponse::success(
            CountryResource::collection($this->countryRepository->listCountries())->resolve(),
        );
    }
}
