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
        Schema::create('external_application_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('job_seeker_id')->constrained('job_seekers');
            $table->foreignUuid('job_listing_id')->constrained('job_listings');
            $table->timestamp('opened_at');
            $table->timestamp('created_at')->useCurrent();
            $table->foreignUuid('created_by')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('external_application_logs');
    }
};
