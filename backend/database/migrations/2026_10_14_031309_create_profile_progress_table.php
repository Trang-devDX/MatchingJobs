<?php

use App\Enums\OnboardProgressStatusEnum;
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
        Schema::create('profile_progress', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->index()->constrained(table: 'users');
            $table->boolean('has_profile')->default(false);
            $table->boolean('has_education')->default(false);
            $table->boolean('has_work_experience')->default(false);
            $table->boolean('has_license')->default(false);
            $table->boolean('has_skill')->default(false);
            $table->tinyInteger('completeness_percent')->default(0);
            $table->smallInteger('onboard_progress_status')->default(OnboardProgressStatusEnum::SKIP->value);
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
        Schema::dropIfExists('profile_progress');
    }
};
