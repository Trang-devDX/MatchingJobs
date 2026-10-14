<?php

use App\Traits\HasAuthorColumns;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    use HasAuthorColumns;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users');
            $table->foreignUuid('job_listing_id')->constrained('job_listings');
            $table->integer('score')->nullable();
            $table->smallInteger('job_application_status')->default(1)->comment('1: Pending, 2: Reviewed, 3: Shortlisted, 4: Interviewed, 5: Offered, 6: Rejected, 7: Withdrawn, 8: Hired');
            $table->smallInteger('rating')->nullable()->comment('1: Poor, 2: Fair, 3: Good, 4: Very Good, 5: Excellent');
            $table->text('cover_letter')->nullable();
            $table->text('external_cv_url')->nullable();
            $table->timestamp('interview_at')->nullable();
            $table->timestamp('applied_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $this->addAuthorColumns($table);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
