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
        // Job Listing - Industries pivot table
        Schema::create('job_listing_industries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('job_listing_id');
            $table->uuid('job_industry_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('job_listing_id')->references('id')->on('job_listings')->onDelete('cascade');
            $table->foreign('job_industry_id')->references('id')->on('job_industries')->onDelete('cascade');

            // Indexes
            $table->index(['job_listing_id', 'job_industry_id']);
            $table->unique(['job_listing_id', 'job_industry_id'], 'job_listing_industry_unique');
        });

        // Job Listing - Categories pivot table
        Schema::create('job_listing_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('job_listing_id');
            $table->uuid('job_category_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('job_listing_id')->references('id')->on('job_listings')->onDelete('cascade');
            $table->foreign('job_category_id')->references('id')->on('job_categories')->onDelete('cascade');

            // Indexes
            $table->index(['job_listing_id', 'job_category_id']);
            $table->unique(['job_listing_id', 'job_category_id'], 'job_listing_category_unique');
        });

        // Job Listing - Types pivot table
        Schema::create('job_listing_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('job_listing_id');
            $table->uuid('job_type_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('job_listing_id')->references('id')->on('job_listings')->onDelete('cascade');
            $table->foreign('job_type_id')->references('id')->on('job_types')->onDelete('cascade');

            // Indexes
            $table->index(['job_listing_id', 'job_type_id']);
            $table->unique(['job_listing_id', 'job_type_id'], 'job_listing_type_unique');
        });

        // Job Listing - Skills pivot table
        Schema::create('job_listing_skills', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('job_listing_id')->constrained('job_listings');
            $table->string('name');
            $table->timestamps();
        });

        // Job Listing - Educations pivot table
        Schema::create('job_listing_education_levels', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('job_listing_id');
            $table->uuid('education_level_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('job_listing_id')->references('id')->on('job_listings')->onDelete('cascade');
            $table->foreign('education_level_id')->references('id')->on('education_levels')->onDelete('cascade');

            // Indexes
            $table->index(['job_listing_id', 'education_level_id']);
            $table->unique(['job_listing_id', 'education_level_id'], 'job_listing_education_level_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_listing_skills');
        Schema::dropIfExists('job_listing_types');
        Schema::dropIfExists('job_listing_categories');
        Schema::dropIfExists('job_listing_industries');
        Schema::dropIfExists('job_listing_education_levels');
    }
};
