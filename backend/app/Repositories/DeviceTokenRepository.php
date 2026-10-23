<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DeviceTokenRepository
{
    public function upsertByToken(string $token, string $userId): bool
    {
        $now = now();
        $updateColumns = ['user_id', 'last_used_at', 'updated_at'];

        return DB::table('device_tokens')->upsert(
            [[
                'id' => (string) Str::uuid(),
                'user_id' => $userId,
                'token' => $token,
                'type' => 'fcm',
                'last_used_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ]],
            ['token'],
            $updateColumns,
        ) > 0;
    }

    public function deleteByToken(string $token, string $userId): int
    {
        return DB::table('device_tokens')
            ->where('token', $token)
            ->where('user_id', $userId)
            ->delete();
    }

    public function deleteByTokens(array $tokens): int
    {
        return DB::table('device_tokens')
            ->whereIn('token', $tokens)
            ->delete();
    }

    public function pruneOlderThan(int $days): int
    {
        return DB::table('device_tokens')
            ->where('last_used_at', '<', now()->subDays($days))
            ->delete();
    }
}
