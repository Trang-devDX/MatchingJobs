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
        Schema::create('inquiry_responses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('inquiry_id')->index()->constrained(table: 'inquiries')->onDelete('cascade');
            $table->text('response_content');
            $table->smallInteger('action_status')->comment('1: In Progress, 2: Resolved, 3: Closed');
            $table->foreignUuid('action_user_id')->index()->nullable()->constrained(table: 'users');
            $table->timestamp('action_date')->nullable();
            $table->boolean('is_internal')->default(false);
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
        Schema::dropIfExists('inquiry_responses');
    }
};
