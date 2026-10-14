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
        Schema::create('job_seeker_educations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->index()->constrained(table: 'users');
            $table->string('name');
            $table->foreignUuid('education_level_id')->nullable();
            $table->string('field_of_study')->nullable();
            $table->text('description')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->smallInteger('job_seeker_education_status')->nullable()->comment('1: Completed, 2: In progress, 3:In Completed, 4: On Hold');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $this->addAuthorColumns($table);
        });

        Schema::create('job_seeker_experiences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->index()->constrained(table: 'users');
            $table->string('company_name');
            $table->string('job_title');
            $table->string('location')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('description')->nullable();
            $table->smallInteger('employment_type')->nullable()->comment('1: full-time, 2: part-time, 3:freelance, 4: intern');
            $table->smallInteger('job_seeker_experience_status')->nullable()->comment('1: active, 2: ended, 3:on_leave, 4: terminated');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $this->addAuthorColumns($table);
        });

        Schema::create('job_seeker_licenses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->index()->constrained(table: 'users');
            $table->string('name');
            $table->string('issuing_organization')->nullable();
            $table->string('credential_id')->nullable();
            $table->string('credential_url')->nullable();
            $table->string('metadata')->nullable();
            $table->date('issue_date')->nullable();
            $table->date('expiration_date')->nullable();
            $table->text('description')->nullable();
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
        Schema::dropIfExists('job_seeker_licenses');
        Schema::dropIfExists('job_seeker_experiences');
        Schema::dropIfExists('job_seeker_educations');
    }
};
