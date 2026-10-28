<?php

use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\JobSeekerController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->group(function () {
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('login', [AuthController::class, 'login']);
        Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [AuthController::class, 'resetPassword']);
    });

    Route::middleware('auth:administrators')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index']);
        Route::prefix('job-seekers')->group(function () {
            Route::get('/', [JobSeekerController::class, 'index']);
            Route::get('{id}', [JobSeekerController::class, 'show'])->whereUuid('id');
            Route::post('/', [JobSeekerController::class, 'store']);
            Route::post('{id}', [JobSeekerController::class, 'update'])->whereUuid('id');
            Route::delete('{id}', [JobSeekerController::class, 'destroy'])->whereUuid('id');
        });
        Route::get('profile', [AuthController::class, 'profile']);
        Route::post('profile', [AuthController::class, 'updateProfile']);
        Route::post('profile/avatar', [AuthController::class, 'uploadAvatar']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::post('change-password', [AuthController::class, 'changePassword']);
        Route::post('device-tokens', [AuthController::class, 'updateDeviceToken']);
    });
});
