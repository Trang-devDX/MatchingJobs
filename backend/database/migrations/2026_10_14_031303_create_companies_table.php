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
        Schema::create('companies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->smallInteger('status')->comment('1: Active, 9: Disabled');
            $table->string('name');
            $table->string('title')->nullable();
            $table->string('representative_name')->nullable();
            $table->foreignUuid('job_industry_id')->index()->nullable()->constrained(table: 'job_industries');
            $table->string('website_url')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->text('description')->nullable();
            $table->integer('employee_count')->nullable();
            $table->string('establishment_year')->nullable();
            $table->string('email')->nullable();
            $table->string('phone_number')->nullable();
            $table->foreignUuid('country_id')->index()->constrained(table: 'countries');
            $table->foreignUuid('island_id')->index()->nullable()->constrained(table: 'islands');
            $table->foreignUuid('town_id')->index()->nullable()->constrained(table: 'towns');
            $table->text('specific_location')->nullable();
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('logo_url')->nullable();
            $table->text('optional_description')->nullable();
            $table->text('pr_message')->nullable();
            $table->boolean('is_ambassador')->default(false);
            $table->smallInteger('ambassador_position')->nullable();
            $table->string('banner_url')->nullable();
            $table->smallInteger('company_size')->nullable()->comment('1: Startup, 2: Small, 3: Medium, 4: Large, 5: Enterprise');
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->boolean('created_by_admin')->nullable()->default(false);
            $this->addAuthorColumns($table);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
