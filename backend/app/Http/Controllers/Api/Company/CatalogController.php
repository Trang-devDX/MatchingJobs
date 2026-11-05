<?php

namespace App\Http\Controllers\Api\Company;

use App\Http\Controllers\Controller;
use App\Http\Resources\Company\Catalog\NameResource;
use App\Http\Response\ApiResponse;
use App\Repositories\CatalogRepository;
use App\Repositories\CountryRepository;
use Illuminate\Http\JsonResponse;

class CatalogController extends Controller
{
    public function __construct(
        private readonly CatalogRepository $catalog,
        private readonly CountryRepository $countries,
    ) {}

    public function industries(): JsonResponse
    {
        return $this->names($this->catalog->industries());
    }

    public function categories(): JsonResponse
    {
        return $this->names($this->catalog->categories());
    }

    public function types(): JsonResponse
    {
        return $this->names($this->catalog->types());
    }

    public function educationLevels(): JsonResponse
    {
        return $this->names($this->catalog->educationLevels());
    }

    public function countries(): JsonResponse
    {
        return $this->names($this->countries->listCountries());
    }

    public function islands(string $countryId): JsonResponse
    {
        return $this->names($this->catalog->islands($countryId));
    }

    public function towns(string $islandId): JsonResponse
    {
        return $this->names($this->catalog->towns($islandId));
    }

    private function names(mixed $rows): JsonResponse
    {
        return ApiResponse::success(NameResource::collection($rows)->resolve());
    }
}
