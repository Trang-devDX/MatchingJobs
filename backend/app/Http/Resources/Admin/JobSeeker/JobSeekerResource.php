<?php

namespace App\Http\Resources\Admin\JobSeeker;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobSeekerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'email' => $this->email,
            'status' => $this->status,
            'job_seeking_status' => $this->job_seeking_status,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'phone_number' => $this->phone_number,
            'gender' => $this->gender,
            'date_of_birth' => $this->date_of_birth,
            'created_at' => $this->created_at,
        ];
    }
}
