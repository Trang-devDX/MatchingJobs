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
        Schema::create('chat_group_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('chat_group_id')->constrained('chat_groups')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->integer('role')->default(1)->comment('1: member, 2: admin, 3: owner');
            $table->timestamp('joined_at')->useCurrent();
            $table->boolean('is_left')->default(false);
            $table->timestamp('left_at')->nullable();
            $table->boolean('is_muted')->default(false);
            $table->integer('type')->nullable()->default(1);

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
        Schema::dropIfExists('chat_group_members');
    }
};
