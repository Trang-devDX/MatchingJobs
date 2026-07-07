<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Traits\HasAuthorColumns;

return new class extends Migration
{
    use HasAuthorColumns;
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('uploaded_files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->smallInteger('type')->comment('1: Avatar');
            $table->string('name'); // Original file name
            $table->string('path'); // Storage path in S3
            $table->string('content_type');
            $table->integer('size');
            $table->uuidMorphs('fileable');
            $table->text('description')->nullable();
            $table->string('storage_disk')->default('public');
            $table->timestamps();
            $table->softDeletes();
            $this->addAuthorColumns($table);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uploaded_files');
    }
};
