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
        Schema::create('inquiries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('inquiry_number');
            $table->smallInteger('site')->comment('1: Job Seeker, 2: Company, 3: Landing Page');
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone_number')->nullable();
            $table->foreignUuid('company_id')->index()->nullable()->constrained(table: 'companies');
            $table->foreignUuid('user_id')->index()->nullable()->constrained(table: 'users');
            $table->smallInteger('user_type')->comment('1: Job Seeker, 2: Company, 3: Guest');
            $table->foreignUuid('request_type_id')->index()->constrained(table: 'request_types');
            $table->text('content');
            $table->smallInteger('inquiry_status')->default(1)->comment('1: Pending, 2: In Progress, 3: Resolved, 4: Closed');
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
        Schema::dropIfExists('inquiries');
    }
};
