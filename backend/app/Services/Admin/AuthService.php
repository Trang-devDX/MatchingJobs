<?php

namespace App\Services\Admin;

use App\Exceptions\BusinessException;
use App\Exceptions\ConflictException;
use App\Exceptions\ValidationException;
use App\Http\Resources\Admin\Auth\ProfileResource;
use App\Models\Administrator;
use App\Repositories\AdministratorRepository;
use App\Repositories\DeviceTokenRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Exceptions\JWTException as JwtAuthException;
use Tymon\JWTAuth\JWTGuard;

class AuthService
{
    public function __construct(
        private readonly AdministratorRepository $administratorRepository,
        private readonly DeviceTokenRepository $deviceTokenRepository,
    ) {}

    public function loginAdministrator(array $data): array
    {
        /** @var JWTGuard $adminGuard */
        $adminGuard = Auth::guard('administrators');
        $token = $adminGuard->attempt(Arr::only($data, ['email', 'password']));

        if (! $token) {
            throw new BusinessException('Invalid email or password.');
        }

        /** @var Administrator $administrator */
        $administrator = $adminGuard->user();

        if (! $administrator->isActive()) {
            Auth::guard('administrators')->logout();
            throw new BusinessException('Your account is not active.');
        }

        if (! $administrator->email_verified_at) {
            Auth::guard('administrators')->logout();
            throw new BusinessException('Please verify your email before logging in.');
        }

        $this->administratorRepository->updateLastLoginAt($administrator->id, now());

        if ($deviceToken = Arr::get($data, 'device_token')) {
            $this->deviceTokenRepository->upsertByToken($deviceToken, $administrator->user_id);
        }

        return [
            'user' => new ProfileResource($administrator->fresh()),
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $adminGuard->factory()->getTTL(),
        ];
    }

    public function getAdministratorProfile(): Administrator
    {
        /** @var Administrator $administrator */
        $administrator = Auth::guard('administrators')->user();

        return $administrator;
    }

    public function updateAdministratorProfile(array $data): Administrator
    {
        /** @var Administrator $administrator */
        $administrator = Auth::guard('administrators')->user();
        if (
            ! $administrator->updated_at
            || Carbon::parse($data['updated_at'])->getTimestamp() !== $administrator->updated_at->getTimestamp()
        ) {
            throw new ConflictException('This profile has changed. Refresh and try again.');
        }

        $profile = Arr::only($data, ['first_name', 'middle_name', 'last_name']);
        $profile['name'] = implode(' ', array_filter($profile));

        return $this->administratorRepository->update($administrator->id, $profile);
    }

    public function uploadAvatar(array $data): Administrator
    {
        /** @var Administrator $administrator */
        $administrator = Auth::guard('administrators')->user();
        $avatarPath = $administrator->avatar_url;

        if ($avatarPath && (Arr::get($data, 'remove_avatar') || Arr::get($data, 'avatar'))) {
            Storage::disk('public')->delete($avatarPath);
            $avatarPath = null;
        }

        if (($avatar = Arr::get($data, 'avatar')) instanceof UploadedFile) {
            $avatarPath = $avatar->store("avatars/{$administrator->id}", 'public');
        }

        return $this->administratorRepository->update($administrator->id, [
            'avatar_url' => $avatarPath,
        ]);
    }

    public function logoutAdministrator(array $data = []): void
    {
        if (($deviceToken = Arr::get($data, 'device_token')) && ($administrator = Auth::guard('administrators')->user())) {
            $this->deviceTokenRepository->deleteByToken($deviceToken, $administrator->user_id);
        }

        Auth::guard('administrators')->logout();
    }

    public function updateDeviceToken(string $deviceToken): void
    {
        /** @var Administrator $administrator */
        $administrator = Auth::guard('administrators')->user();
        $this->deviceTokenRepository->upsertByToken($deviceToken, $administrator->user_id);
    }

    public function refreshToken(): array
    {
        /** @var JWTGuard $adminGuard */
        $adminGuard = Auth::guard('administrators');

        try {
            $token = $adminGuard->refresh();
        } catch (JwtAuthException) {
            throw new BusinessException('Token could not be refreshed.');
        }

        return [
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $adminGuard->factory()->getTTL(),
        ];
    }

    public function changePassword(array $data): void
    {
        /** @var Administrator $administrator */
        $administrator = Auth::guard('administrators')->user();

        if (! Hash::check($data['current_password'], $administrator->password)) {
            throw new ValidationException('Invalid current password.', [
                'current_password' => ['Invalid current password.'],
            ]);
        }

        $this->administratorRepository->update($administrator->id, [
            'password' => $data['new_password'],
        ]);
    }

    public function sendResetLink(array $data): void
    {
        $status = Password::broker('administrators')->sendResetLink([
            'email' => $data['email'],
        ]);

        if ($status !== Password::RESET_LINK_SENT) {
            throw new ValidationException(trans($status), ['email' => [trans($status)]]);
        }
    }

    public function resetPassword(array $data): void
    {
        $status = Password::broker('administrators')->reset(
            $data,
            function (Administrator $administrator, string $password): void {
                $this->administratorRepository->update($administrator->id, [
                    'password' => $password,
                ]);
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw new BusinessException('This password reset link is invalid or has expired.');
        }
    }
}
