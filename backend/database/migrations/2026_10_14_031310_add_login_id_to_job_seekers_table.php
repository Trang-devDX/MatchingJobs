<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    private const MAX_LOGIN_ID_GENERATION_ATTEMPTS = 100;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('job_seekers', function (Blueprint $table) {
            // Add login_id for job seekers who register without an email
            $table->string('login_id', 15)->nullable()->after('email');
            // Add temp_password for job seekers who register without an email
            $table->string('temp_password', 100)->nullable()->after('login_id');
            // Add register type for job seekers who register without an email
            $table->smallInteger('register_type')->comment('1: Old Register, 2: Admin Register, 3: Job Seeker Register')->default(1)->after('status');
            // Make email nullable to allow User ID registration
            $table->string('email')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_seekers', function (Blueprint $table) {
            $table->string('email')->nullable(false)->change();
            $table->dropColumn('temp_password');
            $table->dropColumn('login_id');
            $table->dropColumn('register_type');
        });
    }
};
