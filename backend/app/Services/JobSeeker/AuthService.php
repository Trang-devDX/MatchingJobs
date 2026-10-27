<?php

namespace App\Services\JobSeeker;

use App\Exceptions\BusinessException;
use App\Exceptions\ValidationException;
use App\Http\Resources\JobSeeker\Auth\ProfileResource;
use App\Models\JobSeeker;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Tymon\JWTAuth\Exceptions\JWTException as JwtAuthException;
use Tymon\JWTAuth\JWTGuard;

class AuthService
{
    public function loginJobSeeker(array $data): array
    {
        /** @var JWTGuard $guard */
        $guard = Auth::guard('job_seekers');
        $token = $guard->attempt(Arr::only($data, ['email', 'password']));

        if (! $token) {
            throw new BusinessException('Invalid email or password.');
        }

        /** @var JobSeeker $jobSeeker */
        $jobSeeker = $guard->user();

        if (! $jobSeeker->isActive()) {
            $guard->logout();
            throw new BusinessException('Your account is not active.');
        }

        $jobSeeker->forceFill(['last_login_at' => now()])->save();

        return [
            'user' => new ProfileResource($jobSeeker->fresh()),
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $guard->factory()->getTTL(),
        ];
    }

    public function getJobSeekerProfile(): JobSeeker
    {
        /** @var JobSeeker $jobSeeker */
        $jobSeeker = Auth::guard('job_seekers')->user();

        return $jobSeeker;
    }

    public function logoutJobSeeker(): void
    {
        Auth::guard('job_seekers')->logout();
    }

    public function refreshToken(): array
    {
        /** @var JWTGuard $guard */
        $guard = Auth::guard('job_seekers');

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
        $status = Password::broker('job_seekers')->sendResetLink(['email' => $data['email']]);

        if ($status !== Password::RESET_LINK_SENT) {
            throw new ValidationException(trans($status), ['email' => [trans($status)]]);
        }
    }

    public function resetPassword(array $data): void
    {
        $status = Password::broker('job_seekers')->reset(
            $data,
            function (JobSeeker $jobSeeker, string $password): void {
                $jobSeeker->forceFill(['password' => $password])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw new BusinessException('This password reset link is invalid or has expired.');
        }
    }
}
