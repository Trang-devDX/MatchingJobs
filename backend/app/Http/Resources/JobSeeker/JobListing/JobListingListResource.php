<?php

namespace App\Http\Resources\JobSeeker\JobListing;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobListingListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'company_name' => $this->company?->name,
            'location' => $this->location,
            'salary_min' => $this->salary_min,
            'salary_max' => $this->salary_max,
            'is_internal_application' => $this->is_internal_application,
            'published_at' => $this->published_at?->toAtomString(),
            'expired_at' => $this->expired_at?->toAtomString(),
            'applied' => (bool) ($this->applied ?? false),
        ];
    }
}
