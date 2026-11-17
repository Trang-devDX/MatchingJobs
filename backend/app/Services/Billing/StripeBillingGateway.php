<?php

namespace App\Services\Billing;

interface StripeBillingGateway
{
    /**
     * @return array{id: string, url: string, amount: int|null, currency: string, payment_intent: string|null}
     */
    public function createCheckoutSession(string $paymentId, string $companyId, string $priceId): array;

    /**
     * @return array{id: string, type: string, session: array<string, mixed>}
     */
    public function constructEvent(string $payload, string $signature): array;
}
