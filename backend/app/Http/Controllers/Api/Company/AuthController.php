<?php

namespace App\Http\Controllers\Api\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Company\Auth\ForgotPasswordRequest;
use App\Http\Requests\Api\Company\Auth\LoginRequest;
use App\Http\Requests\Api\Company\Auth\LogoutRequest;
use App\Http\Requests\Api\Company\Auth\ResetPasswordRequest;
use App\Http\Resources\Company\Auth\ProfileResource;
use App\Http\Response\ApiResponse;
use App\Services\Company\AuthService;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService) {}

    public function login(LoginRequest $request): JsonResponse
    {
        return ApiResponse::success($this->authService->loginStaff($request->validated()), 'Login successful.');
    }

    public function me(): JsonResponse
    {
        return ApiResponse::success(
            new ProfileResource($this->authService->getStaffProfile()),
            'Profile retrieved successfully.',
        );
    }

    public function logout(LogoutRequest $request): JsonResponse
    {
        $this->authService->logoutStaff();

        return ApiResponse::success(null, 'Successfully logged out.');
    }

    public function refresh(): JsonResponse
    {
        return ApiResponse::success($this->authService->refreshToken(), 'Token refreshed successfully.');
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $this->authService->sendResetLink($request->validated());

        return ApiResponse::success(null, 'Password reset link sent.');
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $this->authService->resetPassword($request->validated());

        return ApiResponse::success(null, 'Password reset successful.');
    }
}
