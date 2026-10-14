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
        // Recruitment template - Medias pivot table
        Schema::create('recruitment_template_medias', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('recruitment_template_id')->constrained('recruitment_templates');
            $table->foreignUuid('media_id')->constrained('medias');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();

            // Author columns
            $this->addAuthorColumns($table);
        });

        // Recruitment template - Job industry pivot table
        Schema::create('recruitment_template_industries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('recruitment_template_id')->constrained('recruitment_templates');
            $table->foreignUuid('job_industry_id')->constrained('job_industries');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();

            // Author columns
            $this->addAuthorColumns($table);
        });

        // Recruitment template - Job categories
        Schema::create('recruitment_template_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('recruitment_template_id')->constrained('recruitment_templates');
            $table->foreignUuid('job_category_id')->constrained('job_categories');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();

            // Author columns
            $this->addAuthorColumns($table);
        });

        // Recruitment template - Job categories

        Schema::create('recruitment_template_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('recruitment_template_id')->constrained('recruitment_templates');
            $table->foreignUuid('job_type_id')->constrained('job_types');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();

            // Author columns
            $this->addAuthorColumns($table);
        });

        // Recruitment template - Recruitment Tags

        Schema::create('recruitment_template_tags', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('recruitment_template_id')->constrained('recruitment_templates');
            $table->foreignUuid('recruitment_tag_id')->constrained('recruitment_tags');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();

            // Author columns
            $this->addAuthorColumns($table);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recruitment_template_medias');
        Schema::dropIfExists('recruitment_template_industries');
        Schema::dropIfExists('recruitment_template_categories');
        Schema::dropIfExists('recruitment_template_types');
        Schema::dropIfExists('recruitment_template_tags');
    }
};
