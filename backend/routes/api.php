<?php

use App\Http\Controllers\Api\StripeWebhookController;
use Illuminate\Support\Facades\Route;

Route::post('stripe/webhook', [StripeWebhookController::class, 'handle']);

require __DIR__.'/apiAdmin.php';
require __DIR__.'/apiCompany.php';
require __DIR__.'/apiJobSeeker.php';
