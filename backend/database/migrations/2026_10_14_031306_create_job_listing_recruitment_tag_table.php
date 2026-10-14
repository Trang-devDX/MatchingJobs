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
        Schema::create('job_listing_recruitment_tags', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('job_listing_id');
            $table->uuid('recruitment_tag_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('job_listing_id')->references('id')->on('job_listings')->onDelete('cascade');
            $table->foreign('recruitment_tag_id')->references('id')->on('recruitment_tags')->onDelete('cascade');

            // Indexes
            $table->index(['job_listing_id', 'recruitment_tag_id']);
            $table->unique(['job_listing_id', 'recruitment_tag_id'], 'job_listing_recruitment_tag_unique');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_listing_recruitment_tags');
    }
};
