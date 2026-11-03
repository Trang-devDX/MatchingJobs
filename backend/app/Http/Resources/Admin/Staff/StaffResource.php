<?php

namespace App\Http\Resources\Admin\Staff;

use App\Services\Files\FileStore;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StaffResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'user_id' => $this->user_id,
            'is_root' => $this->is_root,
            'name' => $this->name,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'position' => $this->position,
            'status' => $this->status?->value ?? $this->status,
            'avatar_url' => app(FileStore::class)->url($this->avatar_url),
            'created_at' => $this->created_at?->toAtomString(),
        ];
    }
}
