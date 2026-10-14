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
            $table->smallInteger('salary_unit')->nullable();
            $table->smallInteger('pay_frequency')->nullable();
            $table->smallInteger('salary_type')->default(1)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_listings', function (Blueprint $table) {
            $table->dropColumn('salary_unit');
            $table->dropColumn('pay_frequency');
            $table->dropColumn('salary_type');
        });
    }
};
