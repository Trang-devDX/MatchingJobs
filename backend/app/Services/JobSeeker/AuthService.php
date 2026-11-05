<?php

namespace App\Services\JobSeeker;

use App\Enums\UploadedFileTypeEnum;
use App\Exceptions\BusinessException;
use App\Exceptions\ConflictException;
use App\Exceptions\ValidationException;
use App\Http\Resources\JobSeeker\Auth\ProfileResource;
use App\Models\JobSeeker;
use App\Repositories\JobSeekerRepository;
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
        private readonly JobSeekerRepository $jobSeekerRepository,
        private readonly FileStore $files,
    ) {}

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

    public function updateJobSeekerProfile(array $data): JobSeeker
    {
        /** @var JobSeeker $jobSeeker */
        $jobSeeker = Auth::guard('job_seekers')->user();
        if (
            ! $jobSeeker->updated_at
            || Carbon::parse($data['updated_at'])->getTimestamp() !== $jobSeeker->updated_at->getTimestamp()
        ) {
            throw new ConflictException('This profile has changed. Refresh and try again.');
        }

        $profile = Arr::only($data, ['first_name', 'middle_name', 'last_name']);
        $profile['name'] = implode(' ', array_filter($profile));

        /** @var JobSeeker $updated */
        $updated = $this->jobSeekerRepository->update($jobSeeker->id, $profile);

        return $updated;
    }

    public function uploadAvatar(array $data): JobSeeker
    {
        /** @var JobSeeker $jobSeeker */
        $jobSeeker = Auth::guard('job_seekers')->user();
        $avatar = Arr::get($data, 'avatar');

        /** @var JobSeeker $updated */
        $updated = $this->files->apply(
            $jobSeeker->avatar_url,
            $avatar instanceof UploadedFile ? $avatar : null,
            (bool) Arr::get($data, 'remove_avatar'),
            "avatars/job-seekers/{$jobSeeker->id}",
            UploadedFileTypeEnum::AVATAR,
            $jobSeeker->user_id,
            fn (?string $path) => $this->jobSeekerRepository->update($jobSeeker->id, [
                'avatar_url' => $path,
            ]),
        );

        return $updated;
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
