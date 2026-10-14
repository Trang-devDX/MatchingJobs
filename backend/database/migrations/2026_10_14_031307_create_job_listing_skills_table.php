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
        // Drop old pivot table
        Schema::dropIfExists('job_listing_skills');

        Schema::create('job_listing_skills', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('job_listing_id')->constrained('job_listings');
            $table->string('name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_listing_skills');
    }
};
