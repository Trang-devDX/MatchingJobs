<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Town extends Model
{
    use HasUuids;
    use SoftDeletes;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = ['name', 'country_id', 'island_id', 'sort'];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function island(): BelongsTo
    {
        return $this->belongsTo(Island::class);
    }
}
