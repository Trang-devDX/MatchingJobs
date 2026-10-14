<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('applicant_screening_attributes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('applicant_screening_id')
                ->constrained('applicant_screenings')
                ->cascadeOnDelete();
            $table->string('name');
            $table->smallInteger('type')->comment('1: Licenses, 2: Skills');
            $table->timestamps();

            $table->index('applicant_screening_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicant_screening_attributes');
    }
};
