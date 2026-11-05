<?php

namespace App\Http\Resources\JobSeeker\Auth;

use App\Services\Files\FileStore;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'avatar_url' => app(FileStore::class)->url($this->avatar_url),
            'updated_at' => $this->updated_at?->toAtomString(),
            'last_login_at' => $this->last_login_at?->toAtomString(),
        ];
    }
}
