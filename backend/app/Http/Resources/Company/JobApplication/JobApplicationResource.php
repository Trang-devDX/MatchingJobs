<?php

namespace App\Http\Resources\Company\JobApplication;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'job_listing_id' => $this->job_listing_id,
            'job_title' => $this->jobListing?->title,
            'job_seeker_name' => $this->jobSeeker?->name,
            'job_seeker_email' => $this->jobSeeker?->email,
            'job_application_status' => $this->job_application_status->value,
            'status_label' => $this->job_application_status->label(),
            'cover_letter' => $this->cover_letter,
            'is_viewed' => $this->is_viewed,
            'applied_at' => $this->applied_at?->toAtomString(),
            'updated_at' => $this->updated_at?->toAtomString(),
        ];
    }
}
