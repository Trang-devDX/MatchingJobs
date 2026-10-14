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
        Schema::create('recruitment_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('title')->nullable();
            $table->smallInteger('priority')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->decimal('salary_min')->nullable();
            $table->decimal('salary_max')->nullable();
            $table->smallInteger('experience_level')->nullable();
            $table->boolean('use_company_location')->nullable();
            $table->foreignUuid('education_level_id')->nullable()->constrained('education_levels');
            $table->foreignUuid('country_id')->nullable()->constrained(table: 'countries');
            $table->foreignUuid('island_id')->nullable()->constrained(table: 'islands');
            $table->foreignUuid('town_id')->nullable()->constrained(table: 'towns');
            $table->string('location')->nullable();
            $table->string('address')->nullable();
            $table->text('description')->nullable();
            $table->text('responsibilities')->nullable();
            $table->text('requirements')->nullable();
            $table->text('benefits')->nullable();
            $table->smallInteger('recruitment_template_status')->nullable();
            $table->float('latitude')->nullable();
            $table->float('longitude')->nullable();
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
        Schema::dropIfExists('recruitment_templates');
    }
};
