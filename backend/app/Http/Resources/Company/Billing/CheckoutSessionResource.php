<?php

namespace App\Http\Resources\Company\Billing;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CheckoutSessionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'payment_id' => $this->resource['payment_id'],
            'checkout_url' => $this->resource['checkout_url'],
        ];
    }
}
