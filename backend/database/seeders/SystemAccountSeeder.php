<?php

namespace Database\Seeders;

use App\Enums\CommonStatusEnum;
use App\Enums\UserTypeEnum;
use App\Models\Administrator;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SystemAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $systemAdminUserId = config('app.system_admin_user_id') ?? Str::orderedUuid();

            $user = User::firstOrNew([
                'id' => $systemAdminUserId,
                'type' => UserTypeEnum::ADMINISTRATOR,
            ]);
            $user->save();

            $administrator = Administrator::firstOrNew([
                'user_id' => $systemAdminUserId,
            ]);
            $administrator->user_id = $user->id;
            $administrator->name = 'System Administrator';
            $administrator->first_name = 'System';
            $administrator->last_name = 'Administrator';
            $administrator->email = 'admin@matchingjobs.com';
            $administrator->password = 'abcd1234';
            $administrator->status = CommonStatusEnum::ACTIVE;
            $administrator->email_verified_at = now();
            $administrator->save();
            $administrator->syncRoles('Administrator');

            $this->command?->info('System administrator account seeded.');
        });
    }
}
