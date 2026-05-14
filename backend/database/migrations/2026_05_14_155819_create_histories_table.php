<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('histories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('process_id');
            $table->uuidMorphs('target');
            $table->string('event', 10);
            $table->text('memo')->nullable();
            $table->string('page_path', 2100)->nullable();
            $table->string('page_name', 100)->nullable();
            $table->string('page_title', 100)->nullable();
            $table->string('client_ip', 100)->nullable();
            $table->string('user_agent', 100)->nullable();
            $table->uuid('actioned_by')->nullable();
            $table->timestamp('actioned_at')->useCurrent();

            $table->foreign('actioned_by')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });

        Schema::create('history_details', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->uuid('history_id')->index();
            $table->string('target_table', 100);
            $table->uuid('target_id');
            $table->string('target_column', 100);
            $table->text('old_data')->nullable();
            $table->text('new_data')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('histories');
        Schema::dropIfExists('history_details');
    }
};
