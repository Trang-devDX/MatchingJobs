<?php

namespace App\Http\Resources\JobSeeker\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'total_applications' => $this->resource['total_applications'],
            'pending_applications' => $this->resource['pending_applications'],
            'saved_jobs' => $this->resource['saved_jobs'],
            'followed_companies' => $this->resource['followed_companies'],
        ];
    }
}
