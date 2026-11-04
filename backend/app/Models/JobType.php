<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobType extends Model
{
    use HasUuids;
    use SoftDeletes;

    protected $table = 'job_types';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = ['name', 'sort'];
}
