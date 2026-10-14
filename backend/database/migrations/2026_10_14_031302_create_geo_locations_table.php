<?php

use App\Traits\HasAuthorColumns;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    use HasAuthorColumns;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create countries table
        Schema::create('countries', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->string('name');
            $table->smallInteger('sort')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $this->addAuthorColumns($table);
        });

        // Create islands table
        Schema::create('islands', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->string('name');
            $table->foreignUuid('country_id')->nullable()->index()->constrained(table: 'countries');
            $table->smallInteger('sort')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $this->addAuthorColumns($table);
        });

        // Create towns table
        Schema::create('towns', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->string('name');
            $table->foreignUuid('country_id')->nullable()->index()->constrained(table: 'countries');
            $table->foreignUuid('island_id')->nullable()->index()->constrained(table: 'islands');
            $table->smallInteger('sort')->nullable();
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
        Schema::dropIfExists('towns');
        Schema::dropIfExists('islands');
        Schema::dropIfExists('countries');
    }
};
