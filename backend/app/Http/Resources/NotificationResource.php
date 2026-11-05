<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = is_array($this->data) ? $this->data : [];

        return [
            'id' => $this->id,
            'title' => $data['title'] ?? 'Notification',
            'body' => $data['body'] ?? null,
            'url' => $data['url'] ?? null,
            'read_at' => $this->read_at?->toAtomString(),
            'created_at' => $this->created_at?->toAtomString(),
        ];
    }
}
