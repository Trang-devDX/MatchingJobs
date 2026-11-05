<?php

use App\Http\Controllers\Api\JobSeeker\AuthController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\JobSeeker\DashboardController;
use App\Http\Controllers\Api\JobSeeker\JobApplicationController;
use App\Http\Controllers\Api\JobSeeker\JobListingController;
use Illuminate\Support\Facades\Route;

Route::prefix('jobseeker')->group(function () {
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('login', [AuthController::class, 'login']);
        Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [AuthController::class, 'resetPassword']);
    });

    Route::middleware('auth:job_seekers')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index']);
        Route::get('me', [AuthController::class, 'me']);
        Route::post('device-tokens', [AuthController::class, 'updateDeviceToken']);
        Route::get('jobs', [JobListingController::class, 'index']);
        Route::get('jobs/{id}', [JobListingController::class, 'show'])->whereUuid('id');
        Route::post('jobs/{id}/applications', [JobListingController::class, 'apply'])->whereUuid('id');
        Route::get('notifications/count', [NotificationController::class, 'count']);
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::post('notifications/read-all', [NotificationController::class, 'readAll']);
        Route::post('notifications/{id}/read', [NotificationController::class, 'read'])->whereUuid('id');
        Route::get('applications', [JobApplicationController::class, 'index']);
        Route::get('applications/{id}', [JobApplicationController::class, 'show'])->whereUuid('id');
        Route::post('profile', [AuthController::class, 'updateProfile']);
        Route::post('profile/avatar', [AuthController::class, 'uploadAvatar']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });
});
