<?php

namespace App\Services\Billing;

use App\Enums\PaymentStatusEnum;
use App\Exceptions\ForbiddenException;
use App\Exceptions\ValidationException;
use App\Models\Payment;
use App\Models\Staff;
use App\Repositories\CompanyRepository;
use App\Repositories\PaymentRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BillingService
{
    public function __construct(
        private readonly PaymentRepository $payments,
        private readonly CompanyRepository $companies,
        private readonly StripeBillingGateway $stripe,
    ) {}

    public function summary(): array
    {
        $staff = $this->staff();
        $company = $this->companies->findCompany($staff->company_id);

        return [
            'job_posting_credits' => $company->job_posting_credits,
            'can_purchase' => (bool) $staff->is_root,
            'payments' => $this->payments->recentForCompany($staff->company_id),
        ];
    }

    public function show(string $id): Payment
    {
        return $this->payments->findForCompany($this->staff()->company_id, $id);
    }

    public function checkout(): array
    {
        $staff = $this->staff();
        if (! $staff->is_root) {
            throw new ForbiddenException('Only the company owner can buy job posting credits.');
        }

        $priceId = (string) config('services.stripe.price_id');
        if ($priceId === '') {
            throw new ValidationException('Stripe price is not configured.');
        }

        $payment = $this->payments->insert([
            'company_id' => $staff->company_id,
            'staff_id' => $staff->id,
            'status' => PaymentStatusEnum::PENDING,
            'credits' => 1,
            'currency' => 'usd',
        ]);

        try {
            $session = $this->stripe->createCheckoutSession($payment->id, $staff->company_id, $priceId);
            if ($session['url'] === '') {
                throw new ValidationException('Stripe did not return a checkout URL.');
            }
        } catch (\Throwable $exception) {
            $this->payments->updatePayment($payment, ['status' => PaymentStatusEnum::FAILED]);
            throw $exception;
        }

        $payment = $this->payments->updatePayment($payment, [
            'stripe_checkout_session_id' => $session['id'],
            'stripe_payment_intent_id' => $session['payment_intent'],
            'amount' => $session['amount'],
            'currency' => $session['currency'],
        ]);

        return [
            'payment_id' => $payment->id,
            'checkout_url' => $session['url'],
        ];
    }

    public function handleWebhook(string $payload, string $signature): void
    {
        $event = $this->stripe->constructEvent($payload, $signature);
        Log::info('Stripe webhook received.', [
            'event_id' => $event['id'],
            'type' => $event['type'],
        ]);

        if ($event['type'] !== 'checkout.session.completed') {
            return;
        }

        $session = $event['session'];
        $paymentId = $session['metadata']['payment_id'] ?? null;
        if (! is_string($paymentId) || ($session['payment_status'] ?? null) !== 'paid') {
            return;
        }

        DB::transaction(function () use ($event, $session, $paymentId): void {
            $payment = $this->payments->lock($paymentId);
            if (! $payment || $this->alreadyFulfilled($payment, $event['id'])) {
                return;
            }

            if ($payment->status !== PaymentStatusEnum::PENDING) {
                return;
            }

            $sessionId = $session['id'] ?? null;
            if (! is_string($sessionId) || $sessionId !== $payment->stripe_checkout_session_id) {
                return;
            }

            $companyId = $session['metadata']['company_id'] ?? null;
            if (is_string($companyId) && $companyId !== $payment->company_id) {
                return;
            }

            $paymentIntent = $session['payment_intent'] ?? null;
            $this->payments->updatePayment($payment, [
                'status' => PaymentStatusEnum::PAID,
                'stripe_event_id' => $event['id'],
                'stripe_payment_intent_id' => is_string($paymentIntent) ? $paymentIntent : $payment->stripe_payment_intent_id,
                'paid_at' => now(),
            ]);

            $company = $this->companies->lock($payment->company_id);
            $this->companies->addJobPostingCredits($company, $payment->credits);
        });
    }

    private function alreadyFulfilled(Payment $payment, string $eventId): bool
    {
        return $payment->status === PaymentStatusEnum::PAID || $payment->stripe_event_id === $eventId;
    }

    private function staff(): Staff
    {
        /** @var Staff $staff */
        $staff = Auth::guard('staffs')->user();

        if (! $staff->company_id) {
            throw new ForbiddenException('You are not assigned to a company.');
        }

        return $staff;
    }
}
