<?php

namespace App\Services\Company;

use App\Exceptions\BusinessException;
use App\Exceptions\ValidationException;
use App\Http\Resources\Company\Auth\ProfileResource;
use App\Models\Staff;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Tymon\JWTAuth\Exceptions\JWTException as JwtAuthException;
use Tymon\JWTAuth\JWTGuard;

class AuthService
{
    public function loginStaff(array $data): array
    {
        /** @var JWTGuard $guard */
        $guard = Auth::guard('staffs');
        $token = $guard->attempt(Arr::only($data, ['email', 'password']));

        if (! $token) {
            throw new BusinessException('Invalid email or password.');
        }

        /** @var Staff $staff */
        $staff = $guard->user();

        if (! $staff->isActive()) {
            $guard->logout();
            throw new BusinessException('Your account is not active.');
        }

        $staff->forceFill(['last_login_at' => now()])->save();

        return [
            'user' => new ProfileResource($staff->fresh()),
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $guard->factory()->getTTL(),
        ];
    }

    public function getStaffProfile(): Staff
    {
        /** @var Staff $staff */
        $staff = Auth::guard('staffs')->user();

        return $staff;
    }

    public function logoutStaff(): void
    {
        Auth::guard('staffs')->logout();
    }

    public function refreshToken(): array
    {
        /** @var JWTGuard $guard */
        $guard = Auth::guard('staffs');

        try {
            $token = $guard->refresh();
        } catch (JwtAuthException) {
            throw new BusinessException('Token could not be refreshed.');
        }

        return [
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $guard->factory()->getTTL(),
        ];
    }

    public function sendResetLink(array $data): void
    {
        $status = Password::broker('staffs')->sendResetLink(['email' => $data['email']]);

        if ($status !== Password::RESET_LINK_SENT) {
            throw new ValidationException(trans($status), ['email' => [trans($status)]]);
        }
    }

    public function resetPassword(array $data): void
    {
        $status = Password::broker('staffs')->reset(
            $data,
            function (Staff $staff, string $password): void {
                $staff->forceFill(['password' => $password])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw new BusinessException('This password reset link is invalid or has expired.');
        }
    }
}
