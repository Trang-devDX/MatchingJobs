<?php

namespace App\Services\Billing;

use App\Exceptions\InvalidStripeSignatureException;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Exception\UnexpectedValueException;
use Stripe\StripeClient;
use Stripe\Webhook;

class StripeCheckoutGateway implements StripeBillingGateway
{
    public function createCheckoutSession(string $paymentId, string $companyId, string $priceId): array
    {
        $stripe = new StripeClient((string) config('services.stripe.secret'));
        $session = $stripe->checkout->sessions->create([
            'mode' => 'payment',
            'line_items' => [[
                'price' => $priceId,
                'quantity' => 1,
            ]],
            'success_url' => $this->urlWithPaymentId((string) config('services.stripe.success_url'), $paymentId),
            'cancel_url' => (string) config('services.stripe.cancel_url'),
            'client_reference_id' => $paymentId,
            'metadata' => [
                'payment_id' => $paymentId,
                'company_id' => $companyId,
            ],
        ]);

        $paymentIntent = $session->payment_intent;

        return [
            'id' => (string) $session->id,
            'url' => (string) $session->url,
            'amount' => $session->amount_total === null ? null : (int) $session->amount_total,
            'currency' => $session->currency ? (string) $session->currency : 'usd',
            'payment_intent' => is_string($paymentIntent) ? $paymentIntent : null,
        ];
    }

    public function constructEvent(string $payload, string $signature): array
    {
        try {
            $event = Webhook::constructEvent(
                $payload,
                $signature,
                (string) config('services.stripe.webhook_secret'),
                (int) config('services.stripe.webhook_tolerance'),
            );
        } catch (SignatureVerificationException|UnexpectedValueException) {
            throw new InvalidStripeSignatureException('Invalid Stripe signature.');
        }

        return [
            'id' => (string) $event->id,
            'type' => (string) $event->type,
            'session' => $event->data->object->toArray(),
        ];
    }

    private function urlWithPaymentId(string $url, string $paymentId): string
    {
        $separator = str_contains($url, '?') ? '&' : '?';

        return $url.$separator.'payment_id='.$paymentId;
    }
}
