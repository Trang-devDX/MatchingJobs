<?php

namespace App\Models;

use App\Enums\CommonStatusEnum;
use App\Enums\UserTypeEnum;
use Illuminate\Auth\Authenticatable as AuthenticatableTrait;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Administrator extends Model implements Authenticatable, CanResetPasswordContract, JWTSubject
{
    use AuthenticatableTrait;
    use CanResetPassword;
    use HasRoles;
    use HasUuids;
    use Notifiable;
    use SoftDeletes;

    protected $table = 'administrators';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'name',
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'password',
        'status',
        'email_verified_at',
        'timezone',
        'locale',
        'avatar_url',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'status' => CommonStatusEnum::class,
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'type' => UserTypeEnum::ADMINISTRATOR->value,
            'email' => $this->email,
        ];
    }
}
