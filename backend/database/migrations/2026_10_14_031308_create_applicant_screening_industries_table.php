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
        Schema::create('applicant_screening_industries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('applicant_screening_id');
            $table->foreignUuid('job_industry_id');
            $table->timestamps();

            $table->index(['applicant_screening_id', 'job_industry_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicant_screening_industries');
    }
};
