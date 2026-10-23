<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\Auth\ChangePasswordRequest;
use App\Http\Requests\Api\Admin\Auth\DeviceTokenUpdateRequest;
use App\Http\Requests\Api\Admin\Auth\ForgotPasswordRequest;
use App\Http\Requests\Api\Admin\Auth\LoginRequest;
use App\Http\Requests\Api\Admin\Auth\LogoutRequest;
use App\Http\Requests\Api\Admin\Auth\ResetPasswordRequest;
use App\Http\Requests\Api\Admin\Auth\UpdateProfileRequest;
use App\Http\Requests\Api\Admin\Auth\UploadAvatarRequest;
use App\Http\Resources\Admin\Auth\ProfileResource;
use App\Http\Response\ApiResponse;
use App\Services\Admin\AuthService;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService) {}

    public function login(LoginRequest $request): JsonResponse
    {
        return ApiResponse::success(
            $this->authService->loginAdministrator($request->validated()),
            'Login successful.',
        );
    }

    public function profile(): JsonResponse
    {
        return ApiResponse::success(
            new ProfileResource($this->authService->getAdministratorProfile()),
            'Profile retrieved successfully.',
        );
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        return ApiResponse::success(
            new ProfileResource($this->authService->updateAdministratorProfile($request->validated())),
            'Profile updated successfully.',
        );
    }

    public function uploadAvatar(UploadAvatarRequest $request): JsonResponse
    {
        return ApiResponse::success(
            new ProfileResource($this->authService->uploadAvatar($request->validated())),
            'Profile updated successfully.',
        );
    }

    public function logout(LogoutRequest $request): JsonResponse
    {
        $this->authService->logoutAdministrator($request->validated());

        return ApiResponse::success(null, 'Successfully logged out.');
    }

    public function refresh(): JsonResponse
    {
        return ApiResponse::success(
            $this->authService->refreshToken(),
            'Token refreshed successfully.',
        );
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $this->authService->changePassword($request->validated());

        return ApiResponse::success(null, 'Password updated successfully.');
    }

    public function updateDeviceToken(DeviceTokenUpdateRequest $request): JsonResponse
    {
        $this->authService->updateDeviceToken($request->validated('token'));

        return ApiResponse::success();
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
