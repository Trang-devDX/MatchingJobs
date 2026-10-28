<?php

namespace App\Http\Resources\Company\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'total_jobs' => $this->resource['total_jobs'],
            'published_jobs' => $this->resource['published_jobs'],
            'total_applications' => $this->resource['total_applications'],
            'pending_applications' => $this->resource['pending_applications'],
        ];
    }
}
