<?php

use App\Http\Controllers\Api\JobSeeker\AuthController;
use App\Http\Controllers\Api\JobSeeker\DashboardController;
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
        Route::post('profile', [AuthController::class, 'updateProfile']);
        Route::post('profile/avatar', [AuthController::class, 'uploadAvatar']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });
});
