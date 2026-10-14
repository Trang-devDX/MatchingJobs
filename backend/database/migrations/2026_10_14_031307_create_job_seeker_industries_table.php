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
        Schema::create('job_seeker_industries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('job_seeker_id');
            $table->foreignUuid('job_industry_id');
            $table->timestamps();

            $table->index(['job_seeker_id', 'job_industry_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_seeker_industries');
    }
};
