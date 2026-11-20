<?php

namespace App\Models;

use App\Enums\JobApplicationStatusEnum;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobApplication extends Model
{
    use HasUuids;
    use SoftDeletes;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'job_listing_id',
        'job_application_status',
        'cover_letter',
        'is_viewed',
        'applied_at',
    ];

    protected function casts(): array
    {
        return [
            'job_application_status' => JobApplicationStatusEnum::class,
            'is_viewed' => 'boolean',
            'applied_at' => 'datetime',
        ];
    }

    public function jobListing(): BelongsTo
    {
        return $this->belongsTo(JobListing::class);
    }

    public function jobSeeker(): BelongsTo
    {
        return $this->belongsTo(JobSeeker::class, 'user_id', 'user_id');
    }
}
