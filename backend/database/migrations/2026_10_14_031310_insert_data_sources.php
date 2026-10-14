<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class () extends Migration {
    public function up(): void
    {
        DB::table('data_sources')->insert([
            ['name' => 'Ministry of Youth', 'sort' => 1, 'description' => 'Ministry of Youth'],
            ['name' => 'Tertiary Scholarships And Loans Service', 'sort' => 2, 'description' => ''],
        ]);
    }

    public function down(): void
    {
    }
};
