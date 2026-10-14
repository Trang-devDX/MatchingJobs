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
        Schema::create('applicant_follows', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->constrained(table: 'companies');
            $table->uuid('job_seeker_id');
            $table->boolean('active')->default(true);
            $table->timestamp('followed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $this->addAuthorColumns($table);

            // Foreign keys
            $table->foreign('job_seeker_id')->references('id')->on('job_seekers')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');

            // Indexes
            $table->index('followed_at');
            $table->unique(['job_seeker_id', 'company_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicant_follows');
    }
};
