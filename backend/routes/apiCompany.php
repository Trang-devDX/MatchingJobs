<?php

use App\Http\Controllers\Api\Company\AuthController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\Company\CatalogController;
use App\Http\Controllers\Api\Company\DashboardController;
use App\Http\Controllers\Api\Company\JobApplicationController;
use App\Http\Controllers\Api\Company\JobListingController;
use Illuminate\Support\Facades\Route;

Route::prefix('company')->group(function () {
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('login', [AuthController::class, 'login']);
        Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [AuthController::class, 'resetPassword']);
    });

    Route::middleware('auth:staffs')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index']);
        Route::get('me', [AuthController::class, 'me']);
        Route::post('device-tokens', [AuthController::class, 'updateDeviceToken']);
        Route::get('notifications/count', [NotificationController::class, 'count']);
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::post('notifications/read-all', [NotificationController::class, 'readAll']);
        Route::post('notifications/{id}/read', [NotificationController::class, 'read'])->whereUuid('id');
        Route::post('profile', [AuthController::class, 'updateProfile']);
        Route::post('profile/avatar', [AuthController::class, 'uploadAvatar']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);

        Route::get('job-industries', [CatalogController::class, 'industries']);
        Route::get('job-categories', [CatalogController::class, 'categories']);
        Route::get('job-types', [CatalogController::class, 'types']);
        Route::get('education-levels', [CatalogController::class, 'educationLevels']);
        Route::get('countries', [CatalogController::class, 'countries']);
        Route::get('countries/{countryId}/islands', [CatalogController::class, 'islands'])->whereUuid('countryId');
        Route::get('islands/{islandId}/towns', [CatalogController::class, 'towns'])->whereUuid('islandId');

        Route::prefix('job-listings')->group(function () {
            Route::get('/', [JobListingController::class, 'index']);
            Route::post('/', [JobListingController::class, 'store']);
            Route::get('{id}', [JobListingController::class, 'show'])->whereUuid('id');
            Route::post('{id}', [JobListingController::class, 'update'])->whereUuid('id');
            Route::delete('{id}', [JobListingController::class, 'destroy'])->whereUuid('id');
        });

        Route::prefix('job-applications')->group(function () {
            Route::get('/', [JobApplicationController::class, 'index']);
            Route::get('{id}', [JobApplicationController::class, 'show'])->whereUuid('id');
            Route::post('{id}', [JobApplicationController::class, 'update'])->whereUuid('id');
        });
    });
});
