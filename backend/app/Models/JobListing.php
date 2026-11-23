<?php

namespace App\Models;

use App\Enums\JobListingPriorityEnum;
use App\Enums\JobListingStatusEnum;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobListing extends Model
{
    use HasUuids;
    use SoftDeletes;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'company_id',
        'job_listings_status',
        'priority_status',
        'title',
        'slug',
        'salary_min',
        'salary_max',
        'experience_level',
        'description',
        'requirements',
        'required_qualification',
        'responsibilities',
        'benefits',
        'use_company_address',
        'country_id',
        'island_id',
        'town_id',
        'location',
        'address',
        'latitude',
        'longitude',
        'external_application_url',
        'is_internal_application',
        'salary_unit',
        'pay_frequency',
        'salary_type',
        'quantity',
        'published_at',
        'expired_at',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'job_listings_status' => JobListingStatusEnum::class,
            'priority_status' => JobListingPriorityEnum::class,
            'salary_min' => 'decimal:2',
            'salary_max' => 'decimal:2',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'use_company_address' => 'boolean',
            'is_internal_application' => 'boolean',
            'experience_level' => 'integer',
            'salary_unit' => 'integer',
            'pay_frequency' => 'integer',
            'salary_type' => 'integer',
            'quantity' => 'integer',
            'published_at' => 'datetime',
            'expired_at' => 'datetime',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function island(): BelongsTo
    {
        return $this->belongsTo(Island::class);
    }

    public function town(): BelongsTo
    {
        return $this->belongsTo(Town::class);
    }

    public function jobIndustries(): BelongsToMany
    {
        return $this->belongsToMany(JobIndustry::class, 'job_listing_industries')->withTimestamps();
    }

    public function jobCategories(): BelongsToMany
    {
        return $this->belongsToMany(JobCategory::class, 'job_listing_categories')->withTimestamps();
    }

    public function jobTypes(): BelongsToMany
    {
        return $this->belongsToMany(JobType::class, 'job_listing_types')->withTimestamps();
    }

    public function educationLevels(): BelongsToMany
    {
        return $this->belongsToMany(EducationLevel::class, 'job_listing_education_levels')->withTimestamps();
    }

    public function jobSkills(): HasMany
    {
        return $this->hasMany(JobListingSkill::class);
    }

    public function jobApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function isExpired(): bool
    {
        return $this->expired_at !== null && $this->expired_at->lte(now());
    }

    public function acceptsApplications(): bool
    {
        return $this->is_internal_application
            && $this->job_listings_status === JobListingStatusEnum::PUBLISHED
            && ! $this->isExpired();
    }

    public function displayStatus(): JobListingStatusEnum
    {
        if ($this->isExpired()) {
            return JobListingStatusEnum::CLOSED;
        }

        return $this->job_listings_status;
    }

    public function hasApplications(): bool
    {
        if (array_key_exists('job_applications_exists', $this->attributes)) {
            return (bool) $this->job_applications_exists;
        }

        return $this->jobApplications()->exists();
    }

    public function canEdit(): bool
    {
        return ! $this->isExpired()
            && $this->job_listings_status !== JobListingStatusEnum::CLOSED
            && ! ($this->job_listings_status === JobListingStatusEnum::PUBLISHED && $this->hasApplications());
    }

    public function canClose(): bool
    {
        return $this->job_listings_status === JobListingStatusEnum::PUBLISHED && ! $this->isExpired();
    }
}
