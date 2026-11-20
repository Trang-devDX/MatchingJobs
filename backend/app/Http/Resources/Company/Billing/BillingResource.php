<?php

namespace App\Http\Resources\Company\Billing;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'job_posting_credits' => $this->resource['job_posting_credits'],
            'can_purchase' => $this->resource['can_purchase'],
            'payments' => PaymentResource::collection($this->resource['payments'])->resolve(),
        ];
    }
}
