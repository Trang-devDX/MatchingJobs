<?php

namespace App\Models;

use App\Enums\CommonStatusEnum;
use App\Enums\UserTypeEnum;
use App\Notifications\AccountPasswordResetNotification;
use Illuminate\Auth\Authenticatable as AuthenticatableTrait;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Staff extends Model implements Authenticatable, CanResetPasswordContract, JWTSubject
{
    use AuthenticatableTrait;
    use CanResetPassword;
    use HasUuids;
    use Notifiable;
    use SoftDeletes;

    protected $table = 'staffs';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'status' => CommonStatusEnum::class,
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }

    public function isActive(): bool
    {
        return $this->status === CommonStatusEnum::ACTIVE;
    }

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return ['user_id' => $this->user_id, 'type' => UserTypeEnum::STAFF->value, 'email' => $this->email];
    }

    public function sendPasswordResetNotification($token): void
    {
        $frontendUrl = config('app.staff_frontend_url');

        if (! is_string($frontendUrl) || $frontendUrl === '') {
            throw new \LogicException('STAFF_FRONTEND_URL must be configured.');
        }

        $url = rtrim($frontendUrl, '/');
        $this->notify(new AccountPasswordResetNotification("{$url}/reset-password?token={$token}&email=".urlencode($this->email)));
    }
}
