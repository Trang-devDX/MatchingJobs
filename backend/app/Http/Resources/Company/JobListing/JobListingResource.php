<?php

namespace App\Http\Resources\Company\JobListing;

use App\Http\Resources\Company\Catalog\NameResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobListingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            ...(new JobListingListResource($this))->toArray($request),
            'slug' => $this->slug,
            'description' => $this->description,
            'requirements' => $this->requirements,
            'required_qualification' => $this->required_qualification,
            'responsibilities' => $this->responsibilities,
            'benefits' => $this->benefits,
            'experience_level' => $this->experience_level,
            'salary_unit' => $this->salary_unit,
            'pay_frequency' => $this->pay_frequency,
            'quantity' => $this->quantity,
            'use_company_address' => $this->use_company_address,
            'country_id' => $this->country_id,
            'island_id' => $this->island_id,
            'town_id' => $this->town_id,
            'country' => $this->country ? new NameResource($this->country) : null,
            'island' => $this->island ? new NameResource($this->island) : null,
            'town' => $this->town ? new NameResource($this->town) : null,
            'location' => $this->location,
            'address' => $this->address,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'is_internal_application' => $this->is_internal_application,
            'external_application_url' => $this->external_application_url,
            'industry_ids' => $this->jobIndustries->pluck('id')->values(),
            'category_ids' => $this->jobCategories->pluck('id')->values(),
            'type_ids' => $this->jobTypes->pluck('id')->values(),
            'education_level_ids' => $this->educationLevels->pluck('id')->values(),
            'industries' => NameResource::collection($this->jobIndustries),
            'categories' => NameResource::collection($this->jobCategories),
            'education_levels' => NameResource::collection($this->educationLevels),
            'skills' => $this->jobSkills->pluck('name')->values(),
        ];
    }
}
