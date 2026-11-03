<?php

namespace App\Models;

use App\Enums\UploadedFileTypeEnum;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class UploadedFile extends Model
{
    use HasUuids;
    use SoftDeletes;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'type',
        'name',
        'path',
        'content_type',
        'size',
        'description',
        'storage_disk',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'type' => UploadedFileTypeEnum::class,
            'size' => 'integer',
        ];
    }

    public function fileable(): MorphTo
    {
        return $this->morphTo();
    }
}
