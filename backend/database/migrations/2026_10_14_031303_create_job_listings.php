<?php

use App\Enums\JobListingPriorityEnum;
use App\Enums\JobListingStatusEnum;
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
        Schema::create('job_listings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained('companies');
            $table->smallInteger('job_listings_status')->default(JobListingStatusEnum::PUBLISHED);
            $table->smallInteger('priority_status')->default(JobListingPriorityEnum::NORMAL);
            $table->string('title');
            $table->string('slug')->nullable();
            $table->decimal('salary_min', 12, 2)->nullable();
            $table->decimal('salary_max', 12, 2)->nullable();
            $table->smallInteger('experience_level')->nullable();
            $table->text('description')->nullable();
            $table->text('requirements')->nullable();
            $table->text('required_qualification')->nullable();
            $table->text('responsibilities')->nullable();
            $table->text('benefits')->nullable();
            $table->boolean('use_company_address')->default(false);
            $table->foreignUuid('country_id')->index()->constrained(table: 'countries');
            $table->foreignUuid('island_id')->index()->constrained(table: 'islands');
            $table->foreignUuid('town_id')->index()->constrained(table: 'towns');
            $table->text('location')->nullable();
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('external_application_url')->nullable();
            $table->boolean('is_internal_application')->default(true);
            $table->smallInteger('salary_unit')->nullable();
            $table->smallInteger('pay_frequency')->nullable();
            $table->smallInteger('salary_type')->default(1)->nullable();
            $table->integer('quantity')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expired_at')->nullable();
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
        Schema::dropIfExists('job_listings');
    }
};
