<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DeviceTokenRepository
{
    public function upsertByToken(string $token, string $userId): bool
    {
        $deviceToken = DB::table('device_tokens')
            ->where('token', $token)
            ->where('user_id', $userId)
            ->first();

        if ($deviceToken) {
            return DB::table('device_tokens')
                ->where('id', $deviceToken->id)
                ->update(['updated_at' => now()]) > 0;
        }

        return DB::table('device_tokens')->insert([
            'id' => (string) Str::uuid(),
            'user_id' => $userId,
            'token' => $token,
            'type' => 'fcm',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function deleteByToken(string $token, string $userId): bool
    {
        return DB::table('device_tokens')
            ->where('token', $token)
            ->where('user_id', $userId)
            ->delete() > 0;
    }
}
