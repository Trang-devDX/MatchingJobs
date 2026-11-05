<?php

namespace App\Http\Resources\Company\JobListing;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobListingListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'job_listings_status' => $this->resource->displayStatus()->value,
            'priority_status' => $this->priority_status?->value ?? $this->priority_status,
            'salary_min' => $this->salary_min,
            'salary_max' => $this->salary_max,
            'salary_type' => $this->salary_type,
            'published_at' => $this->published_at?->toAtomString(),
            'expired_at' => $this->expired_at?->toAtomString(),
            'created_at' => $this->created_at?->toAtomString(),
            'updated_at' => $this->updated_at?->toAtomString(),
            'has_applications' => $this->resource->hasApplications(),
            'can_edit' => $this->resource->canEdit(),
            'can_close' => $this->resource->canClose(),
            'job_types' => $this->jobTypes->map(fn ($type) => ['id' => $type->id, 'name' => $type->name])->values(),
        ];
    }
}
