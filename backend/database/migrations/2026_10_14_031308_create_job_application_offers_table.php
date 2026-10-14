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
        Schema::create('job_application_offers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('job_application_id');
            $table->uuid('job_seeker_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('job_application_id')->references('id')->on('job_applications')->onDelete('cascade');
            $table->foreign('job_seeker_id')->references('id')->on('job_seekers')->onDelete('cascade');

            // Indexes
            $table->index(['job_application_id', 'job_seeker_id']);
            $table->unique(['job_application_id', 'job_seeker_id'], 'job_application_offer_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_application_offers');
    }
};
