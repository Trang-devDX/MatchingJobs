<?php

namespace App\Providers;

use App\Services\Billing\StripeBillingGateway;
use App\Services\Billing\StripeCheckoutGateway;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(StripeBillingGateway::class, StripeCheckoutGateway::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
