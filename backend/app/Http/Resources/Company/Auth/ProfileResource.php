<?php

namespace App\Http\Resources\Company\Auth;

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
            'email' => $this->email,
            'last_login_at' => $this->last_login_at?->toAtomString(),
            'company' => $this->company === null ? null : [
                'id' => $this->company->id,
                'name' => $this->company->name,
                'address' => $this->company->address,
                'specific_location' => $this->company->specific_location,
                'latitude' => $this->company->latitude,
                'longitude' => $this->company->longitude,
                'country' => $this->place($this->company->country),
                'island' => $this->place($this->company->island),
                'town' => $this->place($this->company->town),
            ],
        ];
    }

    private function place(mixed $place): ?array
    {
        if ($place === null) {
            return null;
        }

        return ['id' => $place->id, 'name' => $place->name];
    }
}
