<?php

namespace App\Http\Resources\Admin\Company;

use App\Services\Files\FileStore;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'status' => $this->status?->value ?? $this->status,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'website_url' => $this->website_url,
            'description' => $this->description,
            'country_id' => $this->country_id,
            'country_name' => $this->country?->name,
            'address' => $this->address,
            'logo_url' => app(FileStore::class)->url($this->logo_url),
            'created_at' => $this->created_at?->toAtomString(),
        ];
    }
}
