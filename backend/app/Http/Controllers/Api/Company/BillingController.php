<?php

namespace App\Http\Controllers\Api\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Company\Billing\CheckoutRequest;
use App\Http\Resources\Company\Billing\BillingResource;
use App\Http\Resources\Company\Billing\CheckoutSessionResource;
use App\Http\Resources\Company\Billing\PaymentResource;
use App\Http\Response\ApiResponse;
use App\Services\Billing\BillingService;
use Illuminate\Http\JsonResponse;

class BillingController extends Controller
{
    public function __construct(private readonly BillingService $billing) {}

    public function index(): JsonResponse
    {
        return ApiResponse::success(new BillingResource($this->billing->summary()));
    }

    public function checkout(CheckoutRequest $request): JsonResponse
    {
        $request->validated();

        return ApiResponse::created(
            new CheckoutSessionResource($this->billing->checkout()),
            'Checkout session created.',
        );
    }

    public function show(string $id): JsonResponse
    {
        return ApiResponse::success(new PaymentResource($this->billing->show($id)));
    }
}
