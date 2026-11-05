<?php

namespace App\Services\Company;

use App\Enums\UploadedFileTypeEnum;
use App\Exceptions\BusinessException;
use App\Exceptions\ConflictException;
use App\Exceptions\ValidationException;
use App\Http\Resources\Company\Auth\ProfileResource;
use App\Models\Staff;
use App\Repositories\StaffRepository;
use App\Services\Files\FileStore;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Tymon\JWTAuth\Exceptions\JWTException as JwtAuthException;
use Tymon\JWTAuth\JWTGuard;

class AuthService
{
    public function __construct(
        private readonly StaffRepository $staffRepository,
        private readonly FileStore $files,
    ) {}

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
            'user' => new ProfileResource($staff->fresh()->load($this->companyRelations())),
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $guard->factory()->getTTL(),
        ];
    }

    public function getStaffProfile(): Staff
    {
        /** @var Staff $staff */
        $staff = Auth::guard('staffs')->user();

        return $staff->load($this->companyRelations());
    }

    public function updateStaffProfile(array $data): Staff
    {
        /** @var Staff $staff */
        $staff = Auth::guard('staffs')->user();
        if (
            ! $staff->updated_at
            || Carbon::parse($data['updated_at'])->getTimestamp() !== $staff->updated_at->getTimestamp()
        ) {
            throw new ConflictException('This profile has changed. Refresh and try again.');
        }

        $profile = Arr::only($data, ['first_name', 'middle_name', 'last_name']);
        $profile['name'] = implode(' ', array_filter($profile));

        /** @var Staff $updated */
        $updated = $this->staffRepository->update($staff->id, $profile);

        return $updated->load($this->companyRelations());
    }

    public function uploadAvatar(array $data): Staff
    {
        /** @var Staff $staff */
        $staff = Auth::guard('staffs')->user();
        $avatar = Arr::get($data, 'avatar');

        /** @var Staff $updated */
        $updated = $this->files->apply(
            $staff->avatar_url,
            $avatar instanceof UploadedFile ? $avatar : null,
            (bool) Arr::get($data, 'remove_avatar'),
            "avatars/staffs/{$staff->company_id}",
            UploadedFileTypeEnum::AVATAR,
            $staff->user_id,
            fn (?string $path) => $this->staffRepository->update($staff->id, [
                'avatar_url' => $path,
            ]),
        );

        return $updated->load($this->companyRelations());
    }

    private function companyRelations(): array
    {
        return ['company.country', 'company.island', 'company.town'];
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
