<?php

namespace App\Http\Resources\Admin\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'total_job_seekers' => $this->total_job_seekers,
            'active_job_seekers' => $this->active_job_seekers,
            'total_companies' => $this->total_companies,
            'total_jobs' => $this->total_jobs,
            'active_jobs' => $this->active_jobs,
        ];
    }
}
