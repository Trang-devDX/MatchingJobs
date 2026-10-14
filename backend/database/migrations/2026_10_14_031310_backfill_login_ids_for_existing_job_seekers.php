
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class () extends Migration {
    public function up(): void
    {
        $lastLoginId = (int)DB::table('job_seekers')->max('login_id') ?: 0;

        DB::table('job_seekers')
            ->whereNull('login_id')
            ->orderBy('created_at', 'asc')
            ->chunkById(100, function ($jobSeekers) use (&$lastLoginId) {
                DB::transaction(function () use ($jobSeekers, &$lastLoginId) {
                    foreach ($jobSeekers as $jobSeeker) {
                        $lastLoginId++;
                        $length = max(6, strlen((string)$lastLoginId));
                        $loginId = str_pad((string)$lastLoginId, $length, '0', STR_PAD_LEFT);

                        DB::table('job_seekers')
                            ->where('id', $jobSeeker->id)
                            ->update([
                                'login_id' => $loginId,
                            ]);
                    }
                });
            });
    }

    public function down(): void
    {
    }
};
