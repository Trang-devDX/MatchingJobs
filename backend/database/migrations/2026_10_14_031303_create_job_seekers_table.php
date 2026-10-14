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
        Schema::create('job_seekers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->index()->constrained(table: 'users');
            $table->string('name');
            $table->string('email');
            $table->string('password')->nullable();
            $table->smallInteger('status')->comment('1: Active, 9: Disabled');
            $table->smallInteger('job_seeking_status')->nullable()->comment('1: Seeking, 2: Not Seeking');

            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('viber_number')->nullable();
            $table->string('avatar_url')->nullable();

            $table->smallInteger('gender')->nullable()->comment('1: Male, 2: Female, 9: Other');
            $table->date('date_of_birth')->nullable();
            $table->text('bio')->nullable();

            $table->foreignUuid('country_id')->nullable()->constrained(table: 'countries');
            $table->foreignUuid('island_id')->nullable()->constrained(table: 'islands');
            $table->foreignUuid('town_id')->nullable()->constrained(table: 'towns');
            $table->string('address')->nullable();
            $table->string('postal_code')->nullable();

            $table->string('google_id')->nullable();
            $table->string('facebook_id')->nullable();

            $table->timestamp('email_verified_at')->nullable();
            $table->string('remember_token', 100)->nullable();
            $table->string('timezone', 50)->nullable();
            $table->string('locale', 10)->default('en');
            $table->timestamp('last_login_at')->nullable();
            $table->boolean('is_invisible')->default(false);
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
        Schema::dropIfExists('job_seekers');
    }
};
