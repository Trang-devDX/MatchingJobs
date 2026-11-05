<?php

namespace App\Http\Resources\JobSeeker\JobListing;

use App\Http\Resources\Company\Catalog\NameResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobListingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $application = $this->relationLoaded('currentApplication') ? $this->getRelation('currentApplication') : null;

        return [
            ...(new JobListingListResource($this))->toArray($request),
            'description' => $this->description,
            'requirements' => $this->requirements,
            'responsibilities' => $this->responsibilities,
            'benefits' => $this->benefits,
            'external_application_url' => $this->external_application_url,
            'country' => $this->country ? new NameResource($this->country) : null,
            'island' => $this->island ? new NameResource($this->island) : null,
            'town' => $this->town ? new NameResource($this->town) : null,
            'application' => $application ? [
                'id' => $application->id,
                'job_application_status' => $application->job_application_status->value,
                'status_label' => $application->job_application_status->label(),
                'cover_letter' => $application->cover_letter,
                'applied_at' => $application->applied_at?->toAtomString(),
            ] : null,
        ];
    }
}
