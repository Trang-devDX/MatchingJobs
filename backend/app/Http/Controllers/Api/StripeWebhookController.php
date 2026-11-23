<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Response\ApiResponse;
use App\Services\Billing\BillingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StripeWebhookController extends Controller
{
    public function __construct(private readonly BillingService $billing) {}

    public function handle(Request $request): JsonResponse
    {
        $this->billing->handleWebhook($request->getContent(), (string) $request->header('Stripe-Signature', ''));

        return ApiResponse::success(null, 'Webhook received.');
    }
}
