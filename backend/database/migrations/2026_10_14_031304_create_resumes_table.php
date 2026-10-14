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
        Schema::create('resumes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->index()->constrained(table: 'users');
            $table->string('resume_name');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->smallInteger('gender')->nullable()->comment('1: Male, 2: Female, 9: Other');
            $table->date('date_of_birth')->nullable();
            $table->foreignUuid('country_id')->nullable()->constrained(table: 'countries');
            $table->foreignUuid('island_id')->nullable()->constrained(table: 'islands');
            $table->foreignUuid('town_id')->nullable()->constrained(table: 'towns');
            $table->string('email');
            $table->string('phone_number')->nullable();
            $table->string('viber_number')->nullable();
            $table->string('address')->nullable();
            $table->longText('content');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $this->addAuthorColumns($table);
        });

        Schema::table('job_applications', function (Blueprint $table) {
            $table->foreignUuid('resume_id')->nullable()->constrained('resumes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropColumn('resume_id');
        });
        Schema::dropIfExists('resumes');
    }
};
