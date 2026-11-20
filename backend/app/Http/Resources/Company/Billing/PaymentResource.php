<?php

namespace App\Http\Resources\Company\Billing;

use App\Enums\PaymentStatusEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'credits' => $this->credits,
            'status' => $this->status instanceof PaymentStatusEnum ? $this->status->value : $this->status,
            'paid_at' => $this->paid_at?->toAtomString(),
            'created_at' => $this->created_at?->toAtomString(),
            'job_posting_credits' => $this->whenLoaded(
                'company',
                fn () => $this->company->job_posting_credits,
            ),
        ];
    }
}
