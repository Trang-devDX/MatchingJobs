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
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
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

    protected $fillable = [
        'user_id',
        'company_id',
        'is_root',
        'status',
        'name',
        'email',
        'password',
        'position',
        'phone_number',
        'first_name',
        'middle_name',
        'last_name',
        'email_verified_at',
        'avatar_url',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'status' => CommonStatusEnum::class,
            'is_root' => 'boolean',
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function uploadedFiles(): MorphMany
    {
        return $this->morphMany(UploadedFile::class, 'fileable');
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
