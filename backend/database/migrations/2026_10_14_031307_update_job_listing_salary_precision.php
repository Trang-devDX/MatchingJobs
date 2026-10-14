<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('job_listings', function (Blueprint $table) {
            $table->decimal('salary_min', 12, 2)->nullable()->change();
            $table->decimal('salary_max', 12, 2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_listings', function (Blueprint $table) {
            $table->decimal('salary_min', 10, 2)->nullable()->change();
            $table->decimal('salary_max', 10, 2)->nullable()->change();
        });
    }
};
